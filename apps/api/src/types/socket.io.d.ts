import { UserDocument } from './../../../../packages/shared/src/interfaces/user';
import { UserDocument } from '@repo/shared';
import { Server, Socket } from 'socket.io';
import SocketModule from '../lib/config/socket';

declare module 'socket.io' {
  export interface Socket {
    user?: UserDocument; // Replace 'any' with the type of your user object
  }
}
