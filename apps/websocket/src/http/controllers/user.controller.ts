import { ObjectId } from 'mongodb';
import MongoConnect from '../../config/mongo-connect';
import { UserStatusEnum } from '@repo/shared';

class UserController {
  private user_model;
  constructor() {
    const mongoConnect = MongoConnect.getInstance();
    this.user_model = mongoConnect.getClient().db().collection('users');
  }

  async changeStatusToOffline(user_id: string) {
    return await this.user_model.findOneAndUpdate(
      {
        _id: new ObjectId(user_id),
      },
      {
        $set: {
          is_online: false,
          session_id: '',
        },
      }
    );
  }

  async changeStatusToOnline(user_id: string, session_id: string) {
    return await this.user_model.findOneAndUpdate(
      {
        _id: new ObjectId(user_id),
      },
      {
        $set: {
          is_online: true,
          session_id: session_id,
        },
      }
    );
  }
  async getUserById(user_id: string) {
    return await this.user_model.findOne({
      _id: new ObjectId(user_id),
      status: UserStatusEnum.ACTIVE,
    });
  }
}

export default UserController;
