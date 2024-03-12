import { addNewCommentValidation } from '@repo/shared';
import CommentModel from '../models/Comments.model';
import { NextFunction, Request, Response } from 'express';
import { limitDocumentPerPage } from '../../lib/utils/variables';
import { defaultResponseIfNoData } from '../helpers/response';
import { ERROR_MESSAGES } from '../../lib/utils/error-messages';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

let page = 1;
const CommentController = {
  add: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await addNewCommentValidation.validate(req.body);
      const comment = new CommentModel({
        ...req.body,
        created_by: req.user._id,
      });
      await comment.save();

      res.status(201).json({
        success: true,
      });
    } catch (error) {
      next(createHttpError.BadRequest((error as Error).message));
    }
  },
  getNewest: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.query.page && Number(req.query.page) > 0) {
        page = Number(req.query.page);
      }
      const comments = await CommentModel.aggregate([
        { $sort: { updated_at: -1 } },
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
                  localField: 'created_by',
                  foreignField: '_id',
                  as: 'created_by',
                  pipeline: [
                    {
                      $project: {
                        full_name: 1,
                        email: 1,
                      },
                    },
                  ],
                },
              },
              {
                $unwind: {
                  path: '$created_by',
                  preserveNullAndEmptyArrays: true,
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
          $unwind: {
            path: '$pagination',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            items: '$items',
            pagination: 1,
          },
        },
      ]);

      const data = defaultResponseIfNoData(comments);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(createHttpError.BadRequest((error as Error).message));
    }
  },

  modify: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.comment_id) {
      return next(
        createHttpError.BadRequest(ERROR_MESSAGES.COMMENT.MISSING_COMMENT_ID)
      );
    }
    try {
      await addNewCommentValidation.validate(req.body);

      const comment = await CommentModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(req.params.comment_id),
          created_by: req.user._id,
        },
        {
          $set: {
            content: req.body.content,
          },
        },
        { new: true }
      );
      console.log(comment);

      if (!comment) {
        return next(
          createHttpError.BadRequest(ERROR_MESSAGES.COMMENT.NOT_FOUND)
        );
      }
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(createHttpError.BadRequest((error as Error).message));
    }
  },
  delete: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.comment_id) {
      return next(
        createHttpError.BadRequest(ERROR_MESSAGES.COMMENT.MISSING_COMMENT_ID)
      );
    }

    try {
      const comment = await CommentModel.findOneAndDelete({
        _id: req.params.comment_id,
        created_by: req.user._id,
      });
      if (!comment) {
        return next(
          createHttpError.BadRequest(ERROR_MESSAGES.COMMENT.NOT_FOUND)
        );
      }
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(createHttpError.BadRequest((error as Error).message));
    }
  },
};

export default CommentController;
