import { DeliverOrderDocument } from './../../../../../packages/shared/dist/packages/shared/src/interfaces/delivery-order.d';
import {
  JourneyDocument,
  UserStatusEnum,
  signInValidation,
  signUpValidation,
} from '@repo/shared';
import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import UserModel from '../models/User.model';
import { Error } from 'mongoose';
import { ERROR_MESSAGES } from '../../lib/utils/error-messages';
import {
  generateToken,
  generateVerifyCode,
  verifyToken,
} from '../../lib/utils/token';
import { sendVerifyEmail } from '../../lib/config/nodemailer.config';
import env from '../../lib/config/env';
import { limitDocumentPerPage } from '../../lib/utils/variables';
import { defaultResponseIfNoData } from '../helpers/response';
import { hideUserInfoDependOnFieldBeOnTouch } from '../helpers/formatDocument';

let page = 1;
const UserController = {
  signUp: async function (req: Request, res: Response, next: NextFunction) {
    try {
      await signUpValidation.validate(req.body);

      let user = new UserModel({
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
      });

      user.setPassword(req.body.password);

      // We might using sms verification in the future
      const verify_code = generateVerifyCode(req.body.email);
      const verify_link = `${env.DOMAIN}/verify-email?confirm=${verify_code}&email=${req.body.email}`;
      await sendVerifyEmail(user.email, verify_link);
      await user.save();
      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },
  verify: async function (req: Request, res: Response, next: NextFunction) {
    try {
      const verify_code = req.params.verify_code;
      const decode = verifyToken(verify_code);
      if (
        !(decode as any).email ||
        (decode as any).email !== req.params.email
      ) {
        return next(
          createHttpError.NotFound(
            ERROR_MESSAGES.USER.INVALID_VERIFICATION_CODE
          )
        );
      }

      const user = await UserModel.findOne({
        email: req.params.email,
      });

      if (!user) {
        return next(
          createHttpError.NotFound(
            ERROR_MESSAGES.USER.INVALID_VERIFICATION_CODE
          )
        );
      }
      if (user.status === UserStatusEnum.ACTIVE)
        return res.status(200).json({
          success: true,
          message: 'Your account is already verified',
        });

      await UserModel.findOneAndUpdate(
        {
          email: req.params.email,
        },
        {
          status: UserStatusEnum.ACTIVE,
        },
        {
          new: true,
          upsert: false,
        }
      );
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      if ((error as Error).name === 'TokenExpiredError') {
        await UserModel.findByIdAndDelete({
          email: req.params.email,
        });
      }

      return next(
        createHttpError.BadRequest(
          ERROR_MESSAGES.USER.INVALID_VERIFICATION_CODE
        )
      );
    }
  },

  signIn: async function (req: Request, res: Response, next: NextFunction) {
    try {
      await signInValidation.validate(req.body);
      const user = await UserModel.findOne({
        email: req.body.email,
      });
      if (!user)
        return next(
          createHttpError.BadRequest(ERROR_MESSAGES.USER.EMAIL_WRONG)
        );
      if (user.status === UserStatusEnum.BANNED)
        return next(createHttpError.NotFound(ERROR_MESSAGES.USER.BANNED));
      const isPasswordValid = user.validatePassword(req.body.password);
      if (!isPasswordValid)
        return next(
          createHttpError.BadRequest(ERROR_MESSAGES.USER.PASSWORD_WRONG)
        );
      const payload = generateToken(user._id, user.status as UserStatusEnum);

      return res.status(200).json({
        success: true,
        data: payload,
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },

  update: async function (req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserModel.findOneAndUpdate(
        {
          _id: req.user._id,
        },
        req.body,
        {
          new: true,
          upsert: false,
        }
      );
      if (!user)
        return next(createHttpError.NotFound(ERROR_MESSAGES.USER.NOT_FOUND));
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },
  identifyByBankId: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const id_number = req.params.id_number;
    try {
      // handle the request to identify the user by bank id ( will be implemented later)
      const isIdentified = true;
      const full_name = 'full_name';
      // after the user identified successfully, will receive full_name from the bank id so we can save it in the user's data

      if (!isIdentified)
        return next(
          createHttpError.NotFound(
            ERROR_MESSAGES.USER.SIGN_IN_BY_BANK_ID_FAILED
          )
        );
      let user;
      if (req.user._id) {
        // check if the user has used the same id number and full name before
        if (
          req.user.id_number &&
          req.user.id_number !== id_number &&
          true
          // req.user.full_name !== full_name // will be implemented later
        ) {
          return next(
            createHttpError.BadRequest(ERROR_MESSAGES.USER.INVALID_ID_NUMBER)
          );
        }
        // if the user never used the id number before, then update the user's id number
        user = await UserModel.findOneAndUpdate(
          {
            _id: req.user._id,
          },
          {
            id_number,
          },
          {
            new: true,
            upsert: false,
          }
        );
        if (!user)
          return next(createHttpError.NotFound(ERROR_MESSAGES.USER.NOT_FOUND));
        // after the your identified successfully, sending the new token with is_verified = true to the user for using it in the next requests with expire time 15 minutes
      } else {
        user = await UserModel.findOne({
          id_number,
        });
        if (!user)
          return next(createHttpError.NotFound(ERROR_MESSAGES.USER.NOT_FOUND));
      }

      const new_token = generateToken(
        user._id,
        user.status as UserStatusEnum,
        true
      );

      return res.status(200).json({
        success: true,
        data: {
          new_token,
        },
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },

  getUser: async function (req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserModel.aggregate([
        {
          $match: {
            _id: req.user._id,
            status: UserStatusEnum.ACTIVE,
          },
        },
        {
          $project: {
            _id: 1,
            full_name: 1,
            email: 1,
            phone: 1,
            id_number: 1,
            total_orders_placed: {
              $cond: {
                if: { $isArray: '$orders_placed' },
                then: { $size: '$orders_placed' },
                else: 0,
              },
            },
            total_orders_taken: {
              $cond: {
                if: { $isArray: '$orders_taken' },
                then: { $size: '$orders_taken' },
                else: 0,
              },
            },
            total_journeys_shared: {
              $cond: {
                if: { $isArray: '$journeys_shared' },
                then: { $size: '$journeys_shared' },
                else: 0,
              },
            },
            total_journeys_joined: {
              $cond: {
                if: { $isArray: '$journeys_joined' },
                then: { $size: '$journeys_joined' },
                else: 0,
              },
            },
          },
        },
      ]);

      if (!user)
        return next(createHttpError.NotFound(ERROR_MESSAGES.USER.NOT_FOUND));
      return res.status(200).json({
        success: true,
        data: user[0],
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },

  getHistory: async function (req: Request, res: Response, next: NextFunction) {
    const fieldName = req.query.about?.toString();

    if (!fieldName) {
      return res.status(200).json({
        success: true,
        data: [
          {
            items: [],
            pagination: {
              total: 0,
              pages: 0,
            },
          },
        ],
      });
    }
    try {
      if (req.query.page && Number(req.query.page) > 0) {
        page = Number(req.query.page);
      }
      const collection = fieldName.includes('journeys')
        ? 'journeys'
        : 'deliveryorders';

      const data = await UserModel.aggregate([
        {
          $match: {
            _id: req.user._id,
            status: UserStatusEnum.ACTIVE,
          },
        },
        {
          $project: {
            _id: 0,
            [fieldName]: 1,
          },
        },
        {
          $lookup: {
            from: collection,
            localField: fieldName,
            foreignField: '_id',
            as: fieldName,
            pipeline: [
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
                        email: 1,
                        full_name: 1,
                        phone: 1,
                      },
                    },
                  ],
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
                        email: 1,
                        full_name: 1,
                        phone: 1,
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
              {
                $facet: {
                  items: [
                    {
                      $sort: {
                        created_at: -1,
                        updated_at: -1,
                      },
                    },
                    {
                      $skip: (page - 1) * limitDocumentPerPage,
                    },
                    {
                      $limit: limitDocumentPerPage,
                    },
                    {
                      $project: {
                        __v: 0,
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
            ],
          },
        },
        {
          $unwind: {
            path: `$${fieldName}`,
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: `$${fieldName}.pagination`,
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            items: `$${fieldName}.items`,
            pagination: `$${fieldName}.pagination`,
          },
        },
      ]);
      let result = defaultResponseIfNoData(data);
      if (result.items.length > 0) {
        result = {
          items: result.items.map((item) => {
            return hideUserInfoDependOnFieldBeOnTouch(
              item as JourneyDocument | DeliverOrderDocument,
              req.user._id
            );
          }),
          pagination: result.pagination,
        };
      }

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },
};

export default UserController;
