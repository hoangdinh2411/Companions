import { UserDocument } from '@repo/shared';

declare global {
  namespace Express {
    export interface Request {
      user: Pick<
        UserDocument,
        '_id' | 'phone' | 'id_number' | 'full_name' | 'email'
      >;
      is_identified: boolean;
    }
  }
}
