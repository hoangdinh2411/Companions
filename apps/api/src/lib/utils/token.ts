import jwt from 'jsonwebtoken';
import env from '../config/env';

import { UserStatusEnum } from '@repo/shared';
const fifteenMinutes = '15m';
const oneHour = '1h';
export const generateToken = (
  user_id: string,
  status: UserStatusEnum,
  is_identified = false
) => {
  if (!env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');
  const expiresIn = is_identified ? fifteenMinutes : oneHour;
  return jwt.sign({ _id: user_id, status, is_identified }, env.JWT_SECRET, {
    expiresIn,
  });
};

export const verifyToken = (token: string) => {
  if (!env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');
  return jwt.verify(token, env.JWT_SECRET);
};

export const generateVerifyCode = (email: string) => {
  return jwt.sign({ email }, env.JWT_SECRET, {
    expiresIn: '1d',
  });
};
