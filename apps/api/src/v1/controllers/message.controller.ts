import createHttpError from 'http-errors';
import { limitDocumentPerPage } from '../../lib/utils/variables';
import MessageModel from '../models/Message.model';
import { Request, Response, NextFunction } from 'express';
import { defaultResponseIfNoData } from '../helpers/response';
import mongoose from 'mongoose';

let page = 1;
const MessageController = {
  getMessages: async (req: Request, res: Response, next: NextFunction) => {
    const room_id = req.params.room_id;
    try {
      if (req.query.page) {
        page = parseInt(req.query.page as string);
      }
      const data = await MessageModel.aggregate([
        {
          $match: {
            room: new mongoose.Types.ObjectId(room_id),
          },
        },
        {
          $sort: { updated_at: 1 },
        },
        {
          $facet: {
            items: [
              {
                $skip: (page - 1) * limitDocumentPerPage,
              },
              {
                $limit: limitDocumentPerPage,
              },
              {
                $lookup: {
                  from: 'users',
                  localField: 'sender',
                  foreignField: '_id',
                  as: 'sender',
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
                $unwind: '$sender',
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
      ]);

      return res.status(200).json({
        success: true,
        data: defaultResponseIfNoData(data),
      });
    } catch (error) {
      next(createHttpError(500, (error as Error).message));
    }
  },
};

export default MessageController;
