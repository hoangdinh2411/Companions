import { ObjectId } from 'mongodb';
import MongoConnect from '../../config/mongo-connect';
import { limitDocumentPerPage } from '../utils/variables';
import { ResponseWithPagination, RoomDocument } from '@repo/shared';

let page = 1;
class RoomController {
  private room_model;
  constructor() {
    const mongoConnect = MongoConnect.getInstance();
    this.room_model = mongoConnect.getClient().db().collection('rooms');
  }
  async getAllRoomUserJoined(user_id: string) {
    const result = await this.room_model
      .aggregate([
        {
          $facet: {
            items: [
              {
                $match: {
                  users: {
                    $in: [new ObjectId(user_id)],
                  },
                },
              },
              {
                $skip: (page - 1) * limitDocumentPerPage,
              },
              {
                $limit: limitDocumentPerPage,
              },
              {
                $lookup: {
                  from: 'users',
                  localField: 'users',
                  foreignField: '_id',
                  as: 'users',
                  pipeline: [
                    {
                      $project: {
                        _id: 1,
                        full_name: 1,
                      },
                    },
                  ],
                },
              },
              {
                $sort: {
                  updated_at: 1,
                },
              },
            ],
            pagination: [
              { $count: 'total' },
              {
                $addFields: {
                  pages: {
                    $ceil: {
                      $divide: ['$total', limitDocumentPerPage],
                    },
                  },
                },
              },
            ],
          },
        },
        {
          $unwind: '$pagination',
        },
      ])
      .toArray();

    return result as ResponseWithPagination<RoomDocument>[];
  }
}

export default RoomController;
