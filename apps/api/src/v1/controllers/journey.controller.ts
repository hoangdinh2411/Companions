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
    let limit = 10;
    let startDate;
    try {
      await queryValidation.validate({
        page: req.query.page,
        limit: req.query.limit,
        startDate: req.query.startDate,
      });
      if (req.query.page) page = Number(req.query.page);
      if (req.query.limit) limit = Number(req.query.limit);
      if (req.query.startDate)
        startDate = new Date(req.query.startDate as string);

      const journeys = await JourneyModel.find({
        status: JourneyStatusEnum.ACTIVE,
        startDate: { $gte: dayjs(startDate).format('YYYY-MM-DD') },
      })
        .sort({ created_at: -1 })
        .select('-__v -created_by.id_number -companions.id_number')
        .skip((page - 1) * limit)
        .limit(limit);
      return res.status(200).json({
        success: true,
        data: journeys,
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },

  // on home page
  filter: async (req: Request, res: Response, next: NextFunction) => {
    const startDate = req.query.startDate || '';
    const from = req.query.from || '';
    const to = req.query.to || '';
    try {
      await queryValidation.validate({
        from,
        to,
        startDate,
      });
      const journeys = await JourneyModel.find({
        $or: [
          { from: { $regex: from, $options: 'i' } },
          { to: { $regex: to as string, $options: 'i' } },
        ],
        startDate: { $gte: startDate },
        status: JourneyStatusEnum.ACTIVE,
      })
        .sort({ created_at: -1 })
        .select('-__v -created_by.id_number -companions.id_number');
      return res.status(200).json({
        success: true,
        data: journeys,
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },

  // on journey page
  search: async (req: Request, res: Response, next: NextFunction) => {
    const searchText = req.query.searchText;
    try {
      await queryValidation.validate({
        searchText,
      });
      const journeys = await JourneyModel.find({
        $or: [
          { from: { $regex: searchText, $options: 'i' } },
          { to: { $regex: searchText, $options: 'i' } },
          {
            message: { $regex: searchText, $options: 'i' },
          },
        ],
        startDate: { $gte: dayjs().format('YYYY-MM-DD') },
        status: JourneyStatusEnum.ACTIVE,
      })
        .sort({ created_at: -1 })
        .select('-__v -created_by.id_number -companions.id_number');
      return res.status(200).json({
        success: true,
        data: journeys,
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },
};

export default JourneyController;
