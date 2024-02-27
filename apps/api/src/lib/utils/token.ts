import jwt from 'jsonwebtoken';
import env from '../config/env';

import { UserStatusEnum } from '@repo/shared';
export const generateToken = (user_id: string, status: UserStatusEnum) => {
  if (!env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');
  return jwt.sign({ _id: user_id, status }, env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

export const verifyToken = (token: string) => {
  if (!env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');
  return jwt.verify(token, env.JWT_SECRET);
};
