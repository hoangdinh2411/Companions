import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import env from './env';
async function connectDatabase() {
  try {
    if (!env.DB_URL) new Error('DB_URL is not defined');
    if (mongoose.connection.readyState)
      return console.log('MONGODB ALREADY CONNECTED!!!');
    await mongoose.connect(env.DB_URL || '', {
      autoIndex: false,
    });
    console.log('MONGODB CONNECT SUCCESSFULLY!!!');
  } catch (error) {
    console.log('MONGODB CONNECT ERROR:' + error);
    createHttpError[500]('MONGODB CONNECT ERROR:' + error);
  }
}

export default connectDatabase;
