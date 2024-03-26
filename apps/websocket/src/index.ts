import { createServer } from './server';
import dotenv from 'dotenv';
import http from 'http';
import ChatSocket from './websocket/controllers/chat.socket';
import env from './config/env';
import WebSocket from './config/socket';
import MongoConnect from './config/mongo-connect';

dotenv.config();
const port = env.PORT || 4000;
const app = createServer();
const httpServer = http.createServer(app);
const io = WebSocket.getInstance(httpServer);
const mongodb = MongoConnect.getInstance();
httpServer.listen(port, async () => {
  await mongodb.connect();
  io.initializeHandlers([
    {
      namespace: '/chat',
      handler: new ChatSocket(),
    },
  ]);
  console.log(`Websocket server is running on http://localhost:${port}`);
});
