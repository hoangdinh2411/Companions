import jwt from 'jsonwebtoken';
import env from '../config/env';

import { TokenInterface, UserStatusEnum } from '@repo/shared';
import createHttpError from 'http-errors';
export const generateToken = (user_id: string, status: UserStatusEnum) => {
  if (!env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');
  return jwt.sign({ _id: user_id, status }, env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

export const verifyToken = (token: string) => {
  if (!env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');
  return jwt.verify(token, env.JWT_SECRET);
};
