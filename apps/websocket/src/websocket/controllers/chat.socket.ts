import { Socket } from 'socket.io';
import WebSocketInterface from '../types/websocketInterface';
import { verifyToken } from '../utils/token';
import { JwtPayload } from 'jsonwebtoken';
import UserController from '../../http/controllers/user.controller';
import RoomController from '../../http/controllers/room.controller';
import WebSocket from '../../config/socket';
import { defaultResponseWithPaginationIfNoData } from '../../http/utils/formatResponse';
import { ResponseWithPagination, RoomDocument } from '@repo/shared';

class ChatSocket implements WebSocketInterface {
  socket: Socket | undefined;
  io: WebSocket | undefined;
  handleConnection(io: WebSocket, socket: Socket) {
    console.log('connected');

    this.socket = socket;
    this.io = io;
    this.getRoomListForClient(socket);
    this.handleDisconnection(socket);
  }

  async middlewareImplementation(socket: Socket, next: any) {
    //Implement your middleware for orders here
    const user_controller = new UserController();
    const token = socket.handshake.auth.token as string;

    if (token === '' || token === undefined) {
      return next(new Error('Authentication error'));
    }

    try {
      let decoded = verifyToken(token);
      if (!decoded) {
        return next(new Error('Authentication error'));
      }

      const user = await user_controller.getUserById(
        (decoded as JwtPayload)._id as string
      );

      if (!user) {
        return next(new Error('Authentication error'));
      }
      await user_controller.changeStatusToOnline(
        user._id.toString(),
        socket.id
      );
      socket.user = user;
      next();
    } catch (error) {
      console.log('error', error);

      return next(new Error('Authentication error'));
    }
  }

  async getRoomListForClient(socket: Socket) {
    const room_controller = new RoomController();

    const rooms = await room_controller.getAllRoomUserJoined(socket.user?._id);

    socket.emit('room-list', defaultResponseWithPaginationIfNoData(rooms));
  }
  async handleDisconnection(socket: Socket) {
    socket.on('disconnect', async () => {
      if (socket.user) {
        const user_controller = new UserController();
        await user_controller.changeStatusToOffline(socket.user._id);
      }
      socket.rooms.clear();
    });
  }
}

export default ChatSocket;
