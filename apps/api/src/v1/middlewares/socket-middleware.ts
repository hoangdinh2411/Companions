import UserModel from '../models/User.model';
import { verifyToken } from '../../lib/utils/token';
import { JsonWebTokenError } from 'jsonwebtoken';
import { UserDocument } from '@repo/shared';

export async function socketMiddleware(token: string) {
  if (token === '' || token === undefined) {
    return null;
  }

  try {
    let decoded = verifyToken(token);
    const user = await UserModel.findOne({
      _id: (decoded as any)._id,
      status: {
        $in: ['active'],
      },
    })
      .select('_id name email full_name')
      .lean();

    if (user) {
      return user as UserDocument;
    }
  } catch (error) {
    if (error instanceof JsonWebTokenError && error.message === 'jwt expired') {
      let decoded = verifyToken(token);
      await UserModel.findOneAndUpdate(
        { _id: (decoded as any).id },
        { is_online: false }
      );
      error.message = 'Token expired. Please login again.';
    }

    return null;
  }
}
