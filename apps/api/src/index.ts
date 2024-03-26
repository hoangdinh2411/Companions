import { pingServer, updateStatus } from './lib/config/cron';
import connectDatabase from './lib/config/mongo-connect';
import { createServer } from './server';
import dotenv from 'dotenv';
import http from 'http';
import env from './lib/config/env';

dotenv.config();
const port = env.PORT || 2703;
const app = createServer();
const httpServer = http.createServer(app);
httpServer.listen(port, async () => {
  await connectDatabase();
  console.log(`Server is running on http://localhost:${port}`);
  updateStatus.start();
  pingServer.start();
});
