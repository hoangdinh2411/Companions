import dayjs from 'dayjs';
import DeliveryOrderModel from '../models/DeliveryOrder.model';
import JourneyModel from '../models/Journey.model';
import { Request, Response } from 'express';

const AppController = {
  getStatisticForHomePage: async (req: Request, res: Response) => {
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
      const orders = await DeliveryOrderModel.find({
        status: 'active',
        start_date: {
          $gte: dayjs().format('YYYY-MM-DD'),
        },
      }).countDocuments();

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
      return res.status(500).json({ message: (error as Error).message });
    }
  },
};

export default AppController;
