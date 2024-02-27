import connectDatabase from './lib/database/mongo-connect';
import { createServer } from './server';
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 2703;
const server = createServer();

server.listen(port, async () => {
  await connectDatabase();
  console.log(`Server is running on http://localhost:${port}`);
});
