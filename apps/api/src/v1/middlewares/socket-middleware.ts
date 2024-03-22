import { ERROR_MESSAGES } from '../../lib/utils/error-messages';
import UserModel from '../models/User.model';
import { verifyToken } from '../../lib/utils/token';
import { JsonWebTokenError } from 'jsonwebtoken';
import { Socket } from 'socket.io';

export async function socketMiddleware(
  socket: Socket,
  next: (err?: any) => void
) {
  let token = socket.handshake.headers.token as string;

  if (token !== 'bbb') {
    console.log('error', token);
    next(
      new Error(
        JSON.stringify({
          message: 'Your error message',
          code: 'YOUR_ERROR_CODE',
        })
      )
    );
  }

  next();

  // try {
  //   let decoded = verifyToken(token);
  //   const user = await UserModel.findOne({
  //     _id: (decoded as any)._id,
  //     status: {
  //       $in: ['active'],
  //     },
  //   }).select('-password -id_number');

  //   if (!user) {
  //     next(
  //       new Error(
  //         JSON.stringify({
  //           message: 'Your error message',
  //           code: 'YOUR_ERROR_CODE',
  //         })
  //       )
  //     );
  //   }
  //   return next();
  // } catch (error) {
  //   if (error instanceof JsonWebTokenError && error.message === 'jwt expired') {
  //     let decoded = verifyToken(token);
  //     await UserModel.findOneAndUpdate(
  //       { _id: (decoded as any).id },
  //       { is_online: false }
  //     );
  //     error.message = 'Token expired. Please login again.';
  //   }
  //   console.log('error', error);

  //   next(
  //     new Error(
  //       JSON.stringify({
  //         message: 'Your error message',
  //         code: 'YOUR_ERROR_CODE',
  //       })
  //     )
  //   );
  // }
}
