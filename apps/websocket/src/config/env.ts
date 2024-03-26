import dotenv from 'dotenv';
dotenv.config();
const env = {
  PORT: process.env.PORT || 4000,
  DOMAIN: process.env.DOMAIN,
  JWT_SECRET: process.env.JWT_SECRET || '',
  DB_URL: process.env.DB || '',
  SEND_EMAIL_SERVICE: process.env.SEND_EMAIL_SERVICE || '',
  SEND_EMAIL_USER: process.env.SEND_EMAIL_USER || '',
  SEND_EMAIL_PASSWORD: process.env.SEND_EMAIL_PASSWORD || '',
  SERVER: process.env.SERVER,
  NODE_ENV: process.env.NODE_ENV || 'dev',
};

export default env;
