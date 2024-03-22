import { UserDocument } from '@repo/shared';
import { Server, Socket } from 'socket.io';
import SocketModule from '../lib/config/socket';

declare global {
  var io: Server;

  namespace Express {
    export interface Request {
      user: Pick<
        UserDocument,
        '_id' | 'phone' | 'id_number' | 'full_name' | 'email'
      >;
      is_identified: boolean;
    }
  }

  namespace SocketIO {
    export interface Socket {
      user: UserDocument;
    }
  }
}
