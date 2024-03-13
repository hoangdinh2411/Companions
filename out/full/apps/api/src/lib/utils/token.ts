import jwt from 'jsonwebtoken';
import env from '../config/env';

import { UserStatusEnum } from '@repo/shared';
const fifteenMinutes = 60 * 15;
const oneHour = 60 * 60;
export const generateToken = (
  user_id: string,
  status: UserStatusEnum,
  is_identified = false
) => {
  if (!env.JWT_SECRET) throw new Error('JWT_SECRET is not defined');
  const expiresIn = is_identified ? fifteenMinutes : oneHour;
  const token = jwt.sign(
    { _id: user_id, status, is_identified },
    env.JWT_SECRET,
    {
      expiresIn,
    }
  );
  return {
    token,
    maxAge: expiresIn,
  };
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
