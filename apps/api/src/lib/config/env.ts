import dotenv from 'dotenv';
dotenv.config();
const env = {
  PORT: process.env.PORT || 2703,
  DOMAIN:
    process.env.NODE_ENV === 'prod'
      ? process.env.DOMAIN
      : 'http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET || '',
  DB_URL: process.env.DB || '',
  SEND_EMAIL_SERVICE: process.env.SEND_EMAIL_SERVICE || '',
  SEND_EMAIL_USER: process.env.SEND_EMAIL_USER || '',
  SEND_EMAIL_PASSWORD: process.env.SEND_EMAIL_PASSWORD || '',
  SERVER:
    process.env.NODE_ENV === 'prod'
      ? process.env.SERVER
      : 'http://localhost:2703',
  NODE_ENV: process.env.NODE_ENV || 'dev',
};

export default env;
