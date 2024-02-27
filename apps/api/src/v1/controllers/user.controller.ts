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
import { generateToken } from '../../lib/utils/token';

const UserController = {
  signUp: async function (req: Request, res: Response, next: NextFunction) {
    try {
      await signUpValidation.validate(req.body);

      let user = new UserModel({
        email: req.body.email,
        password: req.body.password,
      });

      user.setPassword(req.body.password);
      await user.save();
      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      return next(createHttpError.BadRequest((error as Error).message));
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
};

export default UserController;
