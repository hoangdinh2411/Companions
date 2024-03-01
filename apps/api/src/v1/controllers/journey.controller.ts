import {
  JourneyStatusEnum,
  journeyRequestValidation,
  queryValidation,
} from '@repo/shared';
import { NextFunction, Request, Response } from 'express';
import JourneyModel from '../models/Journey.model';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import dayjs from 'dayjs';

const JourneyController = {
  add: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await journeyRequestValidation.validate(req.body);
      const journey = new JourneyModel({
        ...req.body,
        created_by: {
          _id: req.user._id,
          email: req.user.email,
          id_number: req.body.id_number,
          phone: req.body.phone,
        },
      });
      await journey.save();

      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    let page = 1;
    let limit = 3;
    try {
      await queryValidation.validate(req.query);

      if (req.query.page) {
        page = Number(req.query.page);
      }
      if (req.query.limit) {
        limit = Number(req.query.limit);
      }

      const data = await JourneyModel.aggregate([
        {
          $match: {
            status: JourneyStatusEnum.ACTIVE,
          },
        },
        {
          $sort: { startDate: 1 },
        },
        {
          $facet: {
            items: [
              {
                $skip: (page - 1) * limit,
              },
              {
                $limit: limit,
              },
            ],
            pagination: [
              { $count: 'total' },
              {
                $addFields: {
                  pages: {
                    $ceil: {
                      $divide: ['$total', limit],
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
        data: data[0],
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },

  filter: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stages = [];
      await queryValidation.validate(req.query);

      stages.push({
        $match: {
          status: JourneyStatusEnum.ACTIVE,
        },
      });
      if (req.query.startDate) {
        const startDate = dayjs(req.query.startDate.toString()).format(
          'YYYY-MM-DD'
        );
        stages.push({
          $match: {
            startDate: {
              $gte: dayjs(startDate).format('YYYY-MM-DD'),
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
          $sort: { startDate: 1 },
        },
        {
          $facet: {
            items: [],
          },
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
        data: data[0],
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },
  // on journey page
  search: async (req: Request, res: Response, next: NextFunction) => {
    const searchText = req.query.searchText || '';
    try {
      await queryValidation.validate({
        searchText,
      });
      const data = await JourneyModel.aggregate([
        {
          $match: {
            status: JourneyStatusEnum.ACTIVE,
            $or: [
              { from: { $regex: searchText.toString(), $options: 'i' } },
              { to: { $regex: searchText.toString(), $options: 'i' } },
              {
                title: { $regex: searchText.toString(), $options: 'i' },
              },
            ],
          },
        },
        {
          $sort: { startDate: 1 },
        },
        {
          $facet: {
            items: [],
          },
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
        data: data[0],
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },
};

export default JourneyController;
