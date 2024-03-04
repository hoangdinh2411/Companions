import {
  DeliveryOrderStatusEnum,
  deliveryOrderRequestValidation,
  queryValidation,
} from '@repo/shared';
import { NextFunction, Request, Response } from 'express';
import DeliveryOrderSchema from '../models/DeliveryOrder.model';
import createHttpError from 'http-errors';
import dayjs from 'dayjs';
import { limitDocumentPerPage } from '../../lib/utils/variables';
import { defaultResponseIfNoData } from '../helpers/response';
import { ERROR_MESSAGES } from '../../lib/utils/error-messages';
import UserModel from '../models/User.model';
let page = 1;

const DeliveryOrderController = {
  add: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deliveryOrderRequestValidation.validate(req.body);
      const new_order = new DeliveryOrderSchema({
        ...req.body,
        start_date: dayjs(req.body.start_date).format('YYYY-MM-DD'),
        end_date: dayjs(req.body.end_date).format('YYYY-MM-DD'),
        created_by: {
          _id: req.user._id,
          email: req.user.email,
          id_number: req.user?.id_number,
          phone: req.body?.phone,
          full_name: req.user?.full_name,
        },
      });
      await new_order.save();
      await UserModel.findByIdAndUpdate(req.user._id, {
        $push: {
          orders_placed: new_order._id,
        },
      });
      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await queryValidation.validate(req.query);

      if (req.query.page) {
        page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
      }

      const data = await DeliveryOrderSchema.aggregate([
        {
          $match: {
            status: DeliveryOrderStatusEnum.ACTIVE,
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

  // on slide component on home page
  filter: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stages = [];
      await queryValidation.validate(req.query);
      if (req.query.page) {
        page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
      }
      stages.push({
        $match: {
          status: DeliveryOrderStatusEnum.ACTIVE,
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

      const data = await DeliveryOrderSchema.aggregate([
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
    const searchText = req.query.searchText || '';
    try {
      await queryValidation.validate({
        searchText,
      });
      if (req.query.page) {
        page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
      }
      const data = await DeliveryOrderSchema.aggregate([
        {
          $match: {
            status: DeliveryOrderStatusEnum.ACTIVE,
            start_date: {
              $gte: dayjs().format('YYYY-MM-DD'),
            },
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

  getOneBySlug: async (req: Request, res: Response, next: NextFunction) => {
    if (req.params.slug === 'undefined')
      return next(createHttpError.BadRequest('Invalid slug'));
    try {
      const data = await DeliveryOrderSchema.findOne({
        slug: req.params.slug,
        status: DeliveryOrderStatusEnum.ACTIVE,
      }).select('-__v -created_by.id_number -companions.id_number');
      if (!data) {
        return next(
          createHttpError.NotFound(ERROR_MESSAGES.DELIVERY_ORDER.NOT_FOUND)
        );
      }
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },
};

export default DeliveryOrderController;
