import http from 'http';
import socketIo, { Socket } from 'socket.io';
import { whitelist } from '../../server';
import { socketMiddleware } from '../../v1/middlewares/socket-middleware';
import UserModel from '../../v1/models/User.model';
import {
  MessageDocument,
  MessageStatusEnum,
  ResponseWithPagination,
  RoomDocument,
  RoomStatusEnum,
} from '@repo/shared';
import { ERROR_MESSAGES } from '../utils/error-messages';
import RoomModel from '../../v1/models/Room.model';
import MessageModel from '../../v1/models/Message.model';
import { limitDocumentPerPage } from '../utils/variables';
import mongoose from 'mongoose';
import { defaultResponseIfNoData } from '../../v1/helpers/response';
import MemoryCache from './node-cache';

class SocketModule {
  private static instance: SocketModule;
  io: socketIo.Server;
  cache: MemoryCache<any> | undefined;
  private constructor(server: http.Server) {
    this.io = new socketIo.Server(server, {
      cors: {
        origin: (origin, callback) => {
          if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    // there is issue with this middleware , cannot receive error message on client

    this.io.use(async (socket, next) => {
      const token = socket.handshake.headers.token;
      const payload = await socketMiddleware(token as string);
      if (!payload) {
        return next(new Error('Authentication error'));
      }
      socket.user = payload;
      next();
    });
    this.io.on('connection', async (socket: Socket) => {
      if (!socket.user) {
        return socket.disconnect();
      }
      this.cache = new MemoryCache({
        stdTTL: 60,
        checkperiod: 120,
      });
      socket.onAny(async (event, ...args) => {
        const token = socket.client.request.headers.token;
        const payload = await socketMiddleware(token as string);
        if (!payload) {
          socket.emit('error', 'Authentication error');
          return socket.disconnect();
        }
      });
      this.getStart(socket);
      this.createRoom(socket);
      this.joinRoom(socket);
      this.getMessages(socket);
      this.handleMessageAndSendToClient(socket);
      this.updateReceivedMessage(socket);
      this.updateReadMessage(socket);
      this.leaveEmptyRoom(socket);
      this.typingOnConversation(socket);
      this.stopTypingOnConversation(socket);
      this.disconnect(socket);
    });
  }
  public static getInstance(server: http.Server): SocketModule {
    if (!SocketModule.instance) {
      SocketModule.instance = new SocketModule(server);
    }
    return SocketModule.instance;
  }

  private leaveEmptyRoom(socket: Socket) {
    socket.on('leave-room', async (room_id: string) => {
      try {
        const messages = await MessageModel.find({
          room: room_id,
        }).countDocuments();
        if (messages === 0) {
          await RoomModel.findByIdAndDelete(room_id);
        }
        socket.leave(room_id);
      } catch (error) {
        this.sendError(socket, (error as Error).message);
      }
    });
  }
  private async getStart(socket: Socket) {
    socket.on('get-start', async () => {
      if (!socket.user) return;
      if (!this.cache) return;
      const cached_data = this.cache.get('room-list') as RoomDocument[];

      if (cached_data) {
        console.log('get-start', cached_data[0]);
        socket.emit('room-list', cached_data);
        return;
      }
      console.log('fetching data from database');

      const user = socket.user;

      try {
        await UserModel.findByIdAndUpdate(socket.user._id, {
          session_id: socket.id,
          is_online: true,
        });
        const rooms = await RoomModel.find({
          users: {
            $in: [user._id],
          },
        })
          .populate('users', '_id  full_name')
          .lean();
        // if there is no rooms or there aren't new created rooms , stop the function
        if (rooms.length) {
          for (let index = 0; index < rooms.length; index++) {
            const last_massages = await MessageModel.findOne({
              room: rooms[index]._id,
            })
              .sort({ updated_at: -1 })
              .limit(1)
              .populate('sender', '_id  full_name')
              .lean();

            // if there is no messages in the room, remove the room from the list
            if (!last_massages) {
              await RoomModel.findByIdAndDelete(rooms[index]._id);
              rooms.splice(index, 1);
              continue;
            }
            // if the last message is sending, update the status to received
            if (last_massages.status === MessageStatusEnum.SENDING) {
              const new_last_massages = await MessageModel.findOneAndUpdate(
                {
                  _id: last_massages._id,
                },
                {
                  status: MessageStatusEnum.RECEIVED,
                },
                {
                  new: true,
                }
              )
                .populate('sender', '_id  full_name')
                .lean();
              Object.assign(rooms[index], {
                messages: [new_last_massages],
              });
            } else {
              // if the last message is received, add the message to the room
              Object.assign(rooms[index], {
                messages: [last_massages],
              });
            }
          }
        }
        this.cache.set('room-list', rooms, 60);
        socket.emit('room-list', rooms);
      } catch (error) {
        this.sendError(socket, (error as Error).message);
      }
    });
  }

  public async createRoom(socket: Socket) {
    socket.on('create-room', async (data: { invitee_id: string }) => {
      if (!socket.user) return;
      try {
        const existing_room = await RoomModel.findOne({
          users: { $all: [socket.user._id, data.invitee_id] },
          status: RoomStatusEnum.ACTIVE,
        })
          .populate('users', '_id full_name')
          .lean();
        if (existing_room) {
          socket.join(existing_room._id);
          socket.emit('room-created', existing_room);
          return;
        }

        const inviter = await UserModel.findById(socket.user._id).lean();
        const invitee = await UserModel.findById(data.invitee_id).lean();
        if (!inviter || !invitee) {
          throw new Error(ERROR_MESSAGES.USER.NOT_FOUND);
        }
        const new_room = await RoomModel.create({
          users: [inviter._id, invitee._id],
          status: RoomStatusEnum.ACTIVE,
        });
        const room = await new_room.populate('users', '_id  full_name ');
        socket.join(room._id);
        socket.emit('room-created', room);
      } catch (error) {
        this.sendError(socket, (error as Error).message);
      }
    });
  }
  private async getMessages(socket: Socket) {
    socket.on(
      'get-messages',
      async (data: { room_id: string; current_page: number }) => {
        if (!socket.user) return;
        const { room_id, current_page } = data;
        let page = 1;
        if (current_page) {
          page = Number(current_page);
        }
        try {
          const last_message = await MessageModel.findOne({
            room: room_id,
          });
          if (last_message) {
            if (
              last_message.sender._id !== socket.user._id &&
              !last_message.seen_by
            ) {
              await MessageModel.updateMany(
                {
                  room: room_id,
                  sender: {
                    $ne: new mongoose.Types.ObjectId(socket.user._id),
                  },
                },
                {
                  $set: {
                    status: MessageStatusEnum.RECEIVED,
                    seen_by: socket.user._id,
                  },
                }
              );
            }
          }
          const list = await MessageModel.aggregate([
            {
              $match: {
                room: new mongoose.Types.ObjectId(room_id),
              },
            },
            {
              // get newest messages first
              $sort: { updated_at: -1 },
            },
            {
              $facet: {
                items: [
                  {
                    $skip: (page - 1) * limitDocumentPerPage,
                  },
                  {
                    $limit: limitDocumentPerPage,
                  },
                  {
                    $lookup: {
                      from: 'users',
                      localField: 'sender',
                      foreignField: '_id',
                      as: 'sender',
                      pipeline: [
                        {
                          $project: {
                            _id: 1,
                            full_name: 1,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $lookup: {
                      from: 'users',
                      localField: 'seen_by',
                      foreignField: '_id',
                      as: 'seen_by',
                      pipeline: [
                        {
                          $project: {
                            _id: 1,
                            full_name: 1,
                          },
                        },
                      ],
                    },
                  },
                  {
                    $sort: {
                      updated_at: 1,
                    },
                  },
                  {
                    $unwind: '$sender',
                  },
                  {
                    $unwind: '$seen_by',
                  },
                ],
                pagination: [
                  { $count: 'total' },
                  {
                    $addFields: {
                      pages: {
                        $ceil: {
                          $divide: ['$total', limitDocumentPerPage],
                        },
                      },
                    },
                  },
                ],
              },
            },
            {
              $unwind: '$pagination',
            },
          ]);
          const result = defaultResponseIfNoData(list);

          socket.emit('receive-messages-list', result);
        } catch (error) {
          this.sendError(socket, (error as Error).message);
        }
      }
    );
  }
  private async sendInvitation(
    socket: Socket,
    receiver_id: string,
    room: RoomDocument
  ) {
    try {
      const receiver_data = await UserModel.findById(receiver_id).lean();
      if (!receiver_data) {
        throw new Error(ERROR_MESSAGES.USER.NOT_FOUND);
      }
      socket.to(receiver_data?.session_id).emit('invitation', room);
    } catch (error) {
      this.sendError(socket, (error as Error).message);
    }
  }
  public acceptInvitation(socket: Socket) {
    socket.on('invitation-accepted', (room_id) => {
      socket.join(room_id);
    });
  }
  public joinRoom(socket: Socket) {
    socket.on('join-room', (room_id) => {
      if (socket.rooms.has(room_id)) return;
      socket.join(room_id);
    });
  }
  private sendError(socket: Socket, error: string) {
    socket.emit('server-error', error);
  }
  private disconnect(socket: Socket) {
    socket.on('disconnect', async () => {
      if (socket.user) {
        await UserModel.findOneAndUpdate(
          {
            _id: socket.user._id,
          },
          {
            session_id: null,
            is_online: false,
          }
        );
      }
      socket.rooms.forEach((room) => {
        socket.leave(room);
      });
    });
  }

  private handleMessageAndSendToClient(socket: Socket) {
    socket.on(
      'send-message',
      async (data: { content: string; room: string; receiver_id: string }) => {
        if (!socket.user) return;

        try {
          const room = await RoomModel.findById(data.room)
            .populate('users', '_id full_name session_id is_online')
            .lean();
          if (!room) {
            throw new Error(ERROR_MESSAGES.ROOM.NOT_FOUND);
          }
          const receiver = room.users.find(
            (user) => user._id.toString() === data.receiver_id
          );

          if (!receiver) {
            throw new Error(ERROR_MESSAGES.USER.NOT_FOUND);
          }
          // get total messages in the room
          const total_messages = await MessageModel.findOne({
            room: data.room,
          }).countDocuments();
          // send invitation to the receiver if this message is the first one
          if (total_messages === 0) {
            this.sendInvitation(socket, data.receiver_id, room);
          }
          const new_message = new MessageModel({
            content: data.content,
            room: data.room,
            sender: socket.user._id,
          });
          await new_message.save();
          let message = await (
            await new_message.populate('sender', '_id full_name ')
          ).populate('room', '_id');

          this.cache?.update('room-list', (value: RoomDocument[]) => {
            return value.map((r) => {
              if (r._id.toString() === room._id.toString()) {
                return {
                  ...r,
                  messages: [message],
                };
              }
              return r;
            });
          });
          if (receiver?.is_online) {
            this.io.to(data.room).emit('receive-message', message);
            room.users.forEach((user) => {
              socket.to(user.session_id).emit('update-room-on-list', message);
            });
          }
        } catch (error) {
          this.sendError(socket, (error as Error).message);
        }
      }
    );
  }

  private updateReceivedMessage(socket: Socket) {
    socket.on(
      'message-received',
      async (data: { room_id: string; message_id: string }) => {
        try {
          const updated_message = await MessageModel.findByIdAndUpdate(
            {
              _id: data.message_id,
              room: data.room_id,
            },
            {
              status: MessageStatusEnum.RECEIVED,
            },
            {
              new: true,
            }
          )
            .populate('sender', '_id full_name')
            .populate('seen_by', '_id full_name')
            .populate('room', '_id users');
          if (updated_message) {
            this.cache?.update('room-list', (value: RoomDocument[]) => {
              return value.map((r) => {
                if (r._id.toString() === updated_message.room._id.toString()) {
                  return {
                    ...r,
                    messages: [updated_message],
                  };
                }
                return r;
              });
            });
            if (updated_message) {
              socket.emit('update-message-to-received', updated_message);
              socket
                .to(data.room_id)
                .emit('update-message-to-received', updated_message);
            }
          }
        } catch (error) {
          this.sendError(socket, (error as Error).message);
        }
      }
    );
  }

  private updateReadMessage(socket: Socket) {
    socket.on('message-read', async (data: { message: MessageDocument }) => {
      if (!socket.user) return;
      try {
        const updated_message = await MessageModel.findOneAndUpdate(
          {
            _id: data.message._id,
            room: data.message.room._id,
            sender: {
              $ne: new mongoose.Types.ObjectId(socket.user._id),
            },
          },
          {
            $set: {
              status: MessageStatusEnum.RECEIVED,
              seen_by: socket.user._id,
            },
          },
          {
            new: true,
          }
        )
          .populate('sender', '_id full_name')
          .populate('seen_by', '_id full_name')
          .populate({
            path: 'room',
            select: '_id users',
            populate: {
              path: 'users',
              select: '_id full_name is_online session_id',
            },
          });
        if (updated_message) {
          this.cache?.update('room-list', (value: RoomDocument[]) => {
            return value.map((room) => {
              if (room._id.toString() === data.message.room._id) {
                return {
                  ...room,
                  messages: [updated_message],
                };
              }
              return room;
            });
          });
          updated_message?.room?.users.forEach((user) => {
            if (user.is_online) {
              socket
                .to(user.session_id)
                .emit('update-message-to-seen', updated_message);
            }
          });
        }
      } catch (error) {
        this.sendError(socket, (error as Error).message);
      }
    });
  }
  private typingOnConversation(socket: Socket) {
    socket.on('typing', (data: { room_id: string }) => {
      if (!socket.user) return;
      this.io.to(data.room_id).emit('sender-typing', socket.user._id);
    });
  }
  private stopTypingOnConversation(socket: Socket) {
    socket.on('stop-typing', (data: { room_id: string }) => {
      if (!socket.user) return;
      this.io.to(data.room_id).emit('sender-stop-typing', socket.user._id);
    });
  }
}

export default SocketModule;
