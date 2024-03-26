import { io } from 'socket.io-client';
import { Server, Socket } from 'socket.io';
import http from 'http';
import env from './env';

const WEBSOCKET_CORS = {
  origin: env.NODE_ENV === 'prod' ? env.DOMAIN : 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
};
class WebSocket extends Server {
  private static io: WebSocket;

  constructor(httpServer: http.Server) {
    super(httpServer, {
      cors: WEBSOCKET_CORS,
    });
  }

  public static getInstance(httpServer: http.Server): WebSocket {
    if (!WebSocket.io) {
      WebSocket.io = new WebSocket(httpServer);
    }

    return WebSocket.io;
  }
  public initializeHandlers(socketHandlers: Array<any>) {
    socketHandlers.forEach((element) => {
      const io = WebSocket.io;
      let namespace = io.of(element.namespace);
      if (element.handler.middlewareImplementation) {
        namespace.use(element.handler.middlewareImplementation);
      }
      namespace.on('connection', (socket: Socket) => {
        element.handler.handleConnection(io, socket);
      });
    });
  }

  public static getIO() {
    return WebSocket.io;
  }
}

export default WebSocket;
