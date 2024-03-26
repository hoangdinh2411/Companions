import env from './env';
import { MongoClient } from 'mongodb';

class MongoConnect {
  private static instance: MongoConnect;
  private client: MongoClient;
  private constructor() {
    this.client = new MongoClient(env.DB_URL || '', {});
  }

  public static getInstance(): MongoConnect {
    if (!MongoConnect.instance) {
      MongoConnect.instance = new MongoConnect();
    }
    return MongoConnect.instance;
  }

  public async connect() {
    try {
      await this.client.connect();
      console.log('MONGODB CONNECT SUCCESSFULLY!!!');
    } catch (error) {
      console.log('MONGODB CONNECT ERROR:' + error);
      throw new Error('MONGODB CONNECT ERROR:' + error);
    }
  }

  public getClient() {
    return this.client;
  }
}

export default MongoConnect;
