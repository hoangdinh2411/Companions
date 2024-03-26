import jwt from 'jsonwebtoken';
import env from '../../config/env';
export const verifyToken = (token: string) => {
  if (!env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');
  return jwt.verify(token, env.JWT_SECRET);
};
