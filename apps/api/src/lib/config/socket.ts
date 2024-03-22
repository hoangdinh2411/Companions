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

class SocketModule {
  private static instance: SocketModule;
  io: socketIo.Server;
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
    this.io.use(socketMiddleware);
    this.io.on('connection', async (socket: Socket) => {
      console.log('a user connected');
      this.getStart(socket);
      this.createRoom(socket);
      this.joinRoom(socket);
      this.getMessages(socket);
      this.handleMessageAndSendToClient(socket);
      this.updateReceivedMessage(socket);
      this.updateReadMessage(socket);
      this.leaveEmptyRoom(socket);
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
    socket.on(
      'get-start',
      async (data: { user_id: string; session_id: string }) => {
        console.log('get-start', data);

        try {
          await UserModel.findByIdAndUpdate(data.user_id, {
            session_id: data.session_id,
          });
          const rooms = await RoomModel.find({
            users: {
              $in: [data.user_id],
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

          socket.emit('room-list', rooms);
        } catch (error) {
          this.sendError(socket, (error as Error).message);
        }
      }
    );
  }

  public async createRoom(socket: Socket) {
    socket.on(
      'create-room',
      async (data: { inviter_id: string; invitee_id: string }) => {
        try {
          const existing_room = await RoomModel.findOne({
            users: { $all: [data.inviter_id, data.invitee_id] },
            status: RoomStatusEnum.ACTIVE,
          })
            .populate('users', '_id full_name')
            .lean();
          if (existing_room) {
            socket.join(existing_room._id);
            socket.emit('room-created', existing_room);
            return;
          }

          const inviter = await UserModel.findById(data.inviter_id).lean();
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
      }
    );
  }
  private async getMessages(socket: Socket) {
    socket.on(
      'get-messages',
      async (data: {
        room_id: string;
        user_id: string;
        current_page: number;
      }) => {
        const { room_id, user_id, current_page } = data;
        let page = 1;
        if (current_page) {
          page = Number(current_page);
        }
        try {
          const last_message = await MessageModel.findOne({
            room: room_id,
          });
          if (last_message) {
            if (last_message.sender._id !== user_id && !last_message.seen_by) {
              await MessageModel.updateMany(
                {
                  room: room_id,
                  sender: {
                    $ne: new mongoose.Types.ObjectId(data.user_id),
                  },
                },
                {
                  $set: {
                    status: MessageStatusEnum.RECEIVED,
                    seen_by: data.user_id,
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
              $sort: { updated_at: 1 },
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
                    $unwind: '$sender',
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

          console.log(result.pagination);

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
    socket.on('disconnect', () => {
      socket.rooms.forEach((room) => {
        socket.leave(room);
      });
    });
  }

  private handleMessageAndSendToClient(socket: Socket) {
    socket.on(
      'send-message',
      async (data: {
        content: string;
        room: string;
        sender_id: string;
        receiver_id: string;
      }) => {
        try {
          const room = await RoomModel.findById(data.room)
            .populate('users', '_id full_name')
            .lean();
          if (!room) {
            throw new Error(ERROR_MESSAGES.ROOM.NOT_FOUND);
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
            sender: data.sender_id,
          });
          await new_message.save();
          let message = await (
            await new_message.populate('sender', '_id full_name email')
          ).populate('room', '_id');
          // ISSUE HERE
          // how to use one emit to send message to all users in the room? Now have to use 2 emits
          // socket.to().emit() will send only for  receiver
          // socket.emit() will send only for sender
          const receiver = await UserModel.findById(data.receiver_id).populate(
            'session_id'
          );
          socket.to(data.room).emit('receive-message', message);
          socket.emit('receive-message', message);

          if (receiver) {
            socket.emit('update-room-on-list', true);
            socket.to(receiver?.session_id).emit('update-room-on-list', true);
          }

          //ISSUE HERE
          // the same issus with the below emit
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
          ).populate('sender', '_id full_name');
          if (updated_message) {
            socket.emit('status-updated-on-conversation', updated_message);
            socket
              .to(data.room_id)
              .emit('status-updated-on-conversation', updated_message);
          }
        } catch (error) {
          this.sendError(socket, (error as Error).message);
        }
      }
    );
  }

  private updateReadMessage(socket: Socket) {
    socket.on(
      'message-read',
      async (data: { message: MessageDocument; user_id: string }) => {
        try {
          const message = await MessageModel.findOneAndUpdate(
            {
              _id: data.message._id,
              room: data.message.room._id,
              sender: {
                $ne: new mongoose.Types.ObjectId(data.user_id),
              },
            },
            {
              $set: {
                status: MessageStatusEnum.RECEIVED,
                seen_by: data.user_id,
              },
            },
            {
              new: true,
            }
          )
            .populate('sender', '_id full_name')
            .populate('room', '_id');
          console.log('updated status');

          socket
            .to(data.message?.room?._id)
            .emit('status-updated-on-conversation', message);
          socket.emit('status-updated-on-conversation', message);
        } catch (error) {
          this.sendError(socket, (error as Error).message);
        }
      }
    );
  }
}

export default SocketModule;
