import {
  JourneyStatusEnum,
  journeyRequestValidation,
  queryValidation,
} from '@repo/shared';
import { NextFunction, Request, Response } from 'express';
import JourneyModel from '../models/Journey.model';
import createHttpError from 'http-errors';
import dayjs from 'dayjs';
import { limitDocumentPerPage } from '../../lib/utils/variables';
import { defaultResponseIfNoData } from '../helpers/response';
import { ERROR_MESSAGES } from '../../lib/utils/error-messages';
import UserModel from '../models/User.model';
import { generateDocumentsForOrders } from '../helpers/insertManyDocument';
import mongoose from 'mongoose';
import { generateSlugFrom } from '../../lib/utils/generate-slug';
import { hideUserInfoDependOnFieldBeOnTouch } from '../helpers/formatDocument';

let page = 1;

const JourneyController = {
  add: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await journeyRequestValidation.validate(req.body);
      const { phone, ...rest } = req.body;
      const journey = new JourneyModel({
        ...rest,
        start_date: dayjs(req.body.start_date).format('YYYY-MM-DD'),
        end_date: dayjs(req.body.end_date).format('YYYY-MM-DD'),
        created_by: new mongoose.Types.ObjectId(req.user._id),
      });
      await journey.save();

      await UserModel.findOneAndUpdate(
        {
          _id: req.user._id,
        },
        {
          $push: {
            journeys_shared: new mongoose.Types.ObjectId(journey._id),
          },
        }
      );
      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },
  join: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.params.journey_id) {
        return next(
          createHttpError.BadRequest(ERROR_MESSAGES.JOURNEY.MISSING_JOURNEY_ID)
        );
      }

      const journey = await JourneyModel.findOneAndUpdate(
        {
          _id: req.params.journey_id,
          status: JourneyStatusEnum.ACTIVE,
          created_by: {
            $ne: new mongoose.Types.ObjectId(req.user._id),
          },
          start_date: {
            $gte: dayjs().format('YYYY-MM-DD'),
          },
          companions: {
            $not: {
              $elemMatch: {
                $eq: new mongoose.Types.ObjectId(req.user._id),
              },
            },
          },
        },
        {
          $push: {
            companions: new mongoose.Types.ObjectId(req.user._id),
          },
        },
        {
          new: true,
          insert: false,
        }
      );
      if (!journey) {
        return next(
          createHttpError.BadRequest(
            ERROR_MESSAGES.JOURNEY.CANNOT_JOIN_THIS_JOURNEY
          )
        );
      }

      await UserModel.findByIdAndUpdate(req.user._id, {
        $push: {
          journeys_joined: new mongoose.Types.ObjectId(journey._id),
        },
      });

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },
  modify: async (req: Request, res: Response, next: NextFunction) => {
    const { journey_id } = req.params;
    if (!journey_id) {
      return next(
        createHttpError.BadRequest(ERROR_MESSAGES.JOURNEY.MISSING_JOURNEY_ID)
      );
    }
    try {
      await journeyRequestValidation.validate(req.body);
      const { start_date, end_date, title, from, to, ...rest } = req.body;

      const journey = await JourneyModel.findOneAndUpdate(
        {
          _id: journey_id,
          status: JourneyStatusEnum.ACTIVE,
          created_by: new mongoose.Types.ObjectId(req.user._id),
        },
        {
          $set: {
            ...rest,
            title,
            from,
            to,
            start_date: dayjs(start_date).format('YYYY-MM-DD'),
            end_date: dayjs(end_date).format('YYYY-MM-DD'),
            slug: generateSlugFrom(title, from, to, start_date, end_date),
          },
        },
        { new: true }
      );

      if (!journey) {
        return next(createHttpError.NotFound(ERROR_MESSAGES.JOURNEY.NOT_FOUND));
      }
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await queryValidation.getAll.validate(req.query);

      if (req.query.page && Number(req.query.page) > 0) {
        page = Number(req.query.page);
      }

      const data = await JourneyModel.aggregate([
        {
          $match: {
            status: JourneyStatusEnum.ACTIVE,
            start_date: {
              $gte: dayjs().format('YYYY-MM-DD'),
            },
          },
        },
        {
          $sort: { start_date: 1, price: 1 },
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
        {
          $project: {
            __v: 0,
            created_at: 0,
            updated_at: 0,
          },
        },
      ]);

      return res.status(200).json({
        success: true,
        data: defaultResponseIfNoData(data),
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },

  // on slide component on home page
  filter: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stages = [];
      await queryValidation.filter.carpooling.validate(req.query);

      if (req.query.page && Number(req.query.page) > 0) {
        page = Number(req.query.page);
      }

      stages.push({
        $match: {
          status: JourneyStatusEnum.ACTIVE,
        },
      });
      if (req.query.start_date) {
        const start_date = dayjs(req.query.start_date.toString()).format(
          'YYYY-MM-DD'
        );
        stages.push({
          $match: {
            start_date: {
              $gte: dayjs(start_date).format('YYYY-MM-DD'),
            },
          },
        });
      }
      if (req.query.from) {
        stages.push({
          $match: {
            from: { $regex: req.query.from.toString(), $options: 'i' },
          },
        });
      }
      if (req.query.to) {
        stages.push({
          $match: {
            to: { $regex: req.query.to.toString(), $options: 'i' },
          },
        });
      }

      const data = await JourneyModel.aggregate([
        ...stages,
        {
          $sort: { start_date: 1 },
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
        {
          $project: {
            __v: 0,
            'created_by.id_number': 0,
            'companions.id_number': 0,
          },
        },
      ]);

      return res.status(200).json({
        success: true,
        data: defaultResponseIfNoData(data),
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },
  // on journey page
  search: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await queryValidation.search.validate(req.query);
      const search_text = req.query.search_text || '';

      if (req.query.page && Number(req.query.page) > 0) {
        page = Number(req.query.page);
      }

      const data = await JourneyModel.aggregate([
        {
          $match: {
            status: JourneyStatusEnum.ACTIVE,
            $or: [
              { from: { $regex: search_text.toString(), $options: 'i' } },
              { to: { $regex: search_text.toString(), $options: 'i' } },
              {
                title: { $regex: search_text.toString(), $options: 'i' },
              },
            ],
          },
        },
        {
          $sort: { start_date: 1 },
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
        {
          $project: {
            __v: 0,
            'created_by.id_number': 0,
            'companions.id_number': 0,
            created_at: 0,
            updated_at: 0,
          },
        },
      ]);
      return res.status(200).json({
        success: true,
        data: defaultResponseIfNoData(data),
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },

  getOneBySlug: async (req: Request, res: Response, next: NextFunction) => {
    if (req.params.slug === 'undefined')
      return next(createHttpError.BadRequest('Invalid slug'));
    try {
      const data = await JourneyModel.aggregate([
        {
          $match: {
            slug: req.params.slug,
            status: JourneyStatusEnum.ACTIVE,
          },
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
                  _id: 1,
                  full_name: 1,
                  email: 1,
                  phone: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: '$created_by',
        },
        {
          $lookup: {
            from: 'users',
            localField: 'companions',
            foreignField: '_id',
            as: 'companions',
            pipeline: [
              {
                $project: {
                  _id: 1,
                  full_name: 1,
                  email: 1,
                  phone: 1,
                },
              },
            ],
          },
        },
      ]);

      if (data.length === 0) {
        return next(createHttpError.NotFound(ERROR_MESSAGES.JOURNEY.NOT_FOUND));
      }

      const result = hideUserInfoDependOnFieldBeOnTouch(
        data[0],
        req?.user?._id
      );
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },
  getOneById: async (req: Request, res: Response, next: NextFunction) => {
    if (req.params.journey_id === 'undefined')
      return next(
        createHttpError.BadRequest(ERROR_MESSAGES.JOURNEY.MISSING_JOURNEY_ID)
      );
    try {
      const data = await JourneyModel.aggregate([
        {
          $match: {
            created_by: new mongoose.Types.ObjectId(req.user._id),
            _id: new mongoose.Types.ObjectId(req.params.journey_id),
            status: JourneyStatusEnum.ACTIVE,
          },
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
                  _id: 1,
                  full_name: 1,
                  email: 1,
                  phone: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: '$created_by',
        },
        {
          $lookup: {
            from: 'users',
            localField: 'companions',
            foreignField: '_id',
            as: 'companions',
            pipeline: [
              {
                $project: {
                  _id: 1,
                  full_name: 1,
                  email: 1,
                  phone: 1,
                },
              },
            ],
          },
        },
      ]);

      if (data.length === 0) {
        return next(createHttpError.NotFound(ERROR_MESSAGES.JOURNEY.NOT_FOUND));
      }

      const result = hideUserInfoDependOnFieldBeOnTouch(
        data[0],
        req?.user?._id
      );
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },

  insertManyDocuments: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // await generateDocuments();
      await generateDocumentsForOrders();
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },
};

export default JourneyController;
