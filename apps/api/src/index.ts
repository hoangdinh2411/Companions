import env from './lib/config/env';
import connectDatabase from './lib/database/mongo-connect';
import { createServer } from './server';
import dotenv from 'dotenv';
import cron from 'node-cron';

dotenv.config();
const port = process.env.PORT || 2703;
const server = createServer();

server.listen(port, async () => {
  await connectDatabase();
  cron.schedule('0 6 * * *', () => {
    console.log('running at 6:00 AM every day');
  });
  console.log(`Server is running on http://localhost:${port}`);
});
