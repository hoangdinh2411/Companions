import { Socket } from 'socket.io';
import WebSocket from '../../config/socket';

interface WebSocketInterface {
  handleConnection(io: WebSocket, socket: Socket): void;
  middlewareImplementation?(socket: Socket, next: any): void;
}

export default WebSocketInterface;
