import {
  UserRoleEnum,
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

const UserController = {
  signUp: async function (req: Request, res: Response, next: NextFunction) {
    try {
      await signUpValidation.validate(req.body);

      let user = new UserModel({
        email: req.body.email,
        password: req.body.password,
      });

      user.setPassword(req.body.password);

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
      const token = generateToken(user._id, user.status as UserStatusEnum);

      return res.status(200).json({
        success: true,
        data: {
          token,
        },
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
      const user = await UserModel.findOne({
        _id: req.user._id,
        status: UserStatusEnum.ACTIVE,
      }).select('email full_name  phone ');

      if (!user)
        return next(createHttpError.NotFound(ERROR_MESSAGES.USER.NOT_FOUND));
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
    }
  },
};

export default UserController;
