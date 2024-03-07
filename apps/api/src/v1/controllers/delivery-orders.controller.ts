import {
  DeliveryOrderStatusEnum,
  TypeOfCommodityEnum,
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
import { ValidationError } from 'yup';
import mongoose from 'mongoose';
let page = 1;

const DeliveryOrderController = {
  add: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deliveryOrderRequestValidation.validate(req.body);
      const new_order = new DeliveryOrderSchema({
        ...req.body,
        start_date: dayjs(req.body.start_date).format('YYYY-MM-DD'),
        end_date: dayjs(req.body.end_date).format('YYYY-MM-DD'),
        weight: Number(req.body.weight).toFixed(2),
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
      await queryValidation.getAll.validate(req.query);

      if (req.query.page && Number(req.query.page) > 0) {
        page = Number(req.query.page);
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
      await queryValidation.filter.shipping.validate(req.query);
      const stages = [];

      if (req.query.page && Number(req.query.page) > 0) {
        page = Number(req.query.page);
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
      if (
        req.query.type_of_commodity &&
        req.query.type_of_commodity !== 'all'
      ) {
        stages.push({
          $match: {
            type_of_commodity: req.query.type_of_commodity.toString(),
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
      return next(createHttpError.BadRequest((error as any).message));
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

      const data = await DeliveryOrderSchema.aggregate([
        {
          $match: {
            status: DeliveryOrderStatusEnum.ACTIVE,
            start_date: {
              $gte: dayjs().format('YYYY-MM-DD'),
            },
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

  takeOrder: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.params.order_id)
      return next(
        createHttpError.BadRequest(
          ERROR_MESSAGES.DELIVERY_ORDER.MISSING_DELIVERY_ORDER_ID
        )
      );
    try {
      const order = await DeliveryOrderSchema.findOneAndUpdate(
        {
          _id: req.params.order_id,
          status: DeliveryOrderStatusEnum.ACTIVE,
          'created_by._id': {
            $ne: new mongoose.Types.ObjectId(req.user._id),
          },
          start_date: {
            $gte: dayjs().format('YYYY-MM-DD'),
          },
          companions: {
            $not: {
              $elemMatch: {
                _id: new mongoose.Types.ObjectId(req.user._id),
              },
            },
          },
        },
        {
          $push: {
            companions: {
              _id: new mongoose.Types.ObjectId(req.user._id),
              email: req.user.email,
              id_number: req.user.id_number,
              phone: req.user.phone,
              full_name: req.user.full_name,
            },
          },
        },
        {
          new: true,
          insert: false,
        }
      );
      if (!order) {
        return next(
          createHttpError.BadRequest(ERROR_MESSAGES.DELIVERY_ORDER.HAS_TAKEN)
        );
      }

      await UserModel.findByIdAndUpdate(req.user._id, {
        $push: {
          orders_taken: order._id,
        },
      });

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },
};

export default DeliveryOrderController;
