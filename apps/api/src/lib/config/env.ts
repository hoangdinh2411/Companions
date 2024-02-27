import dotenv from 'dotenv';
dotenv.config();
const env = {
  JWT_SECRET: process.env.JWT_SECRET || '',
  DB_URL: process.env.DB || '',
};

export default env;
