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
import mongoose from 'mongoose';
import { generateSlugFrom } from '../../lib/utils/generate-slug';
import { hideUserInfoDependOnFieldBeOnTouch } from '../helpers/formatDocument';
let page = 1;

const DeliveryOrderController = {
  add: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deliveryOrderRequestValidation.validate(req.body);
      const { phone, ...rest } = req.body;
      const new_order = new DeliveryOrderSchema({
        ...rest,
        start_date: dayjs(rest.start_date).format('YYYY-MM-DD'),
        end_date: dayjs(rest.end_date).format('YYYY-MM-DD'),
        weight: Number(rest.weight).toFixed(2),
        created_by: new mongoose.Types.ObjectId(req.user._id),
      });
      await new_order.save();
      await UserModel.findOne(
        {
          _id: req.user._id,
          phone: {
            $not: {
              $elemMatch: {
                $eq: phone,
              },
            },
          },
        },
        {
          $push: {
            phone,
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
  modify: async (req: Request, res: Response, next: NextFunction) => {
    const { order_id } = req.params;
    if (!order_id) {
      return next(
        createHttpError.BadRequest(
          ERROR_MESSAGES.DELIVERY_ORDER.MISSING_DELIVERY_ORDER_ID
        )
      );
    }
    try {
      await deliveryOrderRequestValidation.validate(req.body);
      const { phone, ...rest } = req.body;

      const order = await DeliveryOrderSchema.findOneAndUpdate(
        {
          _id: order_id,
          created_by: new mongoose.Types.ObjectId(req.user._id),
          status: DeliveryOrderStatusEnum.ACTIVE,
        },
        {
          $set: {
            ...rest,
            start_date: dayjs(rest.start_date).format('YYYY-MM-DD'),
            end_date: dayjs(rest.end_date).format('YYYY-MM-DD'),
            weight: Number(rest.weight).toFixed(2),
            slug: generateSlugFrom(
              rest.title,
              rest.from,
              rest.to,
              rest.start_date,
              rest.end_date
            ),
          },
        },
        { new: true }
      );

      if (!order) {
        return next(
          createHttpError.NotFound(ERROR_MESSAGES.DELIVERY_ORDER.NOT_FOUND)
        );
      }
      await UserModel.findOne(
        {
          _id: req.user._id,
          phone: {
            $not: {
              $elemMatch: {
                $eq: phone,
              },
            },
          },
        },
        {
          $push: {
            phone,
          },
        }
      );

      return res.status(200).json({
        success: true,
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
      const data = await DeliveryOrderSchema.aggregate([
        {
          $match: {
            slug: req.params.slug,
            status: DeliveryOrderStatusEnum.ACTIVE,
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
                  id_number: 1,
                },
              },
            ],
          },
        },
      ]);
      if (data.length === 0) {
        return next(
          createHttpError.NotFound(ERROR_MESSAGES.DELIVERY_ORDER.NOT_FOUND)
        );
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
      if (!order) {
        return next(
          createHttpError.BadRequest(
            ERROR_MESSAGES.DELIVERY_ORDER.CANNOT_TAKE_THIS_ORDER
          )
        );
      }

      await UserModel.findByIdAndUpdate(req.user._id, {
        $push: {
          orders_taken: new mongoose.Types.ObjectId(order._id),
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
