import { journeyRequestValidation } from '@repo/shared';
import { NextFunction, Request, Response } from 'express';
import JourneyModel from '../models/Journey.model';
import createHttpError from 'http-errors';

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
};

export default JourneyController;
