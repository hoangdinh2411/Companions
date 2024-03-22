import { pingServer, updateStatus } from './lib/config/cron';
import connectDatabase from './lib/database/mongo-connect';
import { createServer } from './server';
import dotenv from 'dotenv';
import http, { Server } from 'http';
import SocketModule from './lib/config/socket';

dotenv.config();
const port = process.env.PORT || 2703;
const app = createServer();
const httpServer = http.createServer(app);
const socketModule = SocketModule.getInstance(httpServer);
global.io = socketModule.io;

httpServer.listen(port, async () => {
  await connectDatabase();
  console.log(`Server is running on http://localhost:${port}`);
  updateStatus.start();
  pingServer.start();
});
