import createHttpError from 'http-errors';
import connectDatabase from './lib/database/mongo-connect';
import { createServer } from './server';
import dotenv from 'dotenv';
import { logEvent } from './v1/helpers/log-helper';
dotenv.config();
const port = process.env.PORT || 2703;
const server = createServer();

server.listen(port, async () => {
  await connectDatabase();
  console.log(`Server is running on http://localhost:${port}`);
});
