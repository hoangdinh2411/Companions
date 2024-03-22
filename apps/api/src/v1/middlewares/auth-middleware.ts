import { Request, Response, NextFunction } from 'express';
import { ERROR_MESSAGES } from '../../lib/utils/error-messages';
import createHttpError from 'http-errors';
import UserModel from '../models/User.model';
import { verifyToken } from '../../lib/utils/token';
import { JsonWebTokenError } from 'jsonwebtoken';

// export const getTokenFromHeaders = (req: Request) => {
//   const {
//     headers: { authorization },
//   } = req;
//   if (authorization && authorization.split(' ')[0] === 'Bearer') {
//     let token = authorization.split(' ')[1];
//     return token;
//   }
//   return '';
// };

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let { token } = req.cookies;

  if (!token)
    return next(
      createHttpError.Unauthorized(ERROR_MESSAGES.USER.MISSING_TOKEN)
    );
  try {
    let decoded = verifyToken(token);
    const user = await UserModel.findOne({
      _id: (decoded as any)._id,
      status: {
        $in: ['active'],
      },
    }).select('-password -id_number');

    if (!user) {
      res.cookie('token', '', {
        expires: new Date(0),
      });
      return next(
        createHttpError.Unauthorized(ERROR_MESSAGES.USER.INVALID_TOKEN)
      );
    }
    req.user = {
      _id: user._id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      id_number: user.id_number,
    };
    req.is_identified = (decoded as any).is_identified;

    next();
  } catch (error) {
    if (
      error instanceof JsonWebTokenError &&
      error.name === 'TokenExpiredError'
    ) {
      let decoded = verifyToken(token);
      await UserModel.findOneAndUpdate(
        { _id: (decoded as any).id },
        { is_online: false }
      );
      res.cookie('token', '', {
        expires: new Date(0),
      });
    }

    return next(
      createHttpError.Unauthorized(
        (error as Error).message || ERROR_MESSAGES.USER.INVALID_TOKEN
      )
    );
  }
}
