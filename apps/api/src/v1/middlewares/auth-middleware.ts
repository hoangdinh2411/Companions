import { Request, Response, NextFunction } from 'express';
import { ERROR_MESSAGES } from '../../lib/utils/error-messages';
import createHttpError from 'http-errors';
import UserModel from '../models/User.model';
import { verifyToken } from '../../lib/utils/token';

// extend the express request object to include the user object
declare global {
  namespace Express {
    export interface Request {
      user: {
        _id: string;
        email: string;
      };
    }
  }
}
const getTokenFromHeaders = (req: Request) => {
  const {
    headers: { authorization },
  } = req;
  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    let token = authorization.split(' ')[1];
    return token;
  }
  return '';
};

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let token = getTokenFromHeaders(req);
    if (!token)
      return next(
        createHttpError.Unauthorized(ERROR_MESSAGES.USER.MISSING_TOKEN)
      );
    let decoded = verifyToken(token);

    const user = await UserModel.findOne({
      _id: (decoded as any)._id,
      status: {
        $in: ['active'],
      },
    });

    if (!user)
      return next(
        createHttpError.Unauthorized(ERROR_MESSAGES.USER.INVALID_TOKEN)
      );
    req.user = {
      _id: user._id,
      email: user.email,
    };
    next();
  } catch (error) {
    return next(
      createHttpError.Unauthorized(
        (error as Error).message || ERROR_MESSAGES.USER.INVALID_TOKEN
      )
    );
  }
}
