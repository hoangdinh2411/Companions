import dotenv from 'dotenv';
dotenv.config();
const env = {
  DOMAIN: process.env.DOMAIN || 'http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET || '',
  DB_URL: process.env.DB || '',
  SEND_EMAIL_SERVICE: process.env.SEND_EMAIL_SERVICE || '',
  SEND_EMAIL_USER: process.env.SEND_EMAIL_USER || '',
  SEND_EMAIL_PASSWORD: process.env.SEND_EMAIL_PASSWORD || '',
  SERVER: process.env.SERVER || 'http://localhost:2703',
};

export default env;
