import dayjs from 'dayjs';
import DeliveryOrderModel from '../models/DeliveryOrder.model';
import JourneyModel from '../models/Journey.model';
import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

const AppController = {
  updateStatusOfOldDocuments: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await DeliveryOrderModel.updateMany(
        {
          status: 'active',
          start_date: {
            $lt: dayjs().format('YYYY-MM-DD'),
          },
        },
        {
          status: 'completed',
        }
      );
      await JourneyModel.updateMany(
        {
          status: 'active',
          start_date: {
            $lt: dayjs().format('YYYY-MM-DD'),
          },
        },
        {
          status: 'completed',
        }
      );
      return res.status(200).json({
        success: true,
        message: 'Updated successfully',
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },
  getStatisticForHomePage: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const orders = await DeliveryOrderModel.find({
        status: 'active',
        start_date: {
          $gte: dayjs().format('YYYY-MM-DD'),
        },
      }).countDocuments();

      const journeys = await JourneyModel.find({
        status: 'active',
        start_date: {
          $gte: dayjs().format('YYYY-MM-DD'),
        },
      }).countDocuments();

      return res.status(200).json({
        success: true,
        data: {
          orders,
          journeys,
        },
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },
};

export default AppController;
