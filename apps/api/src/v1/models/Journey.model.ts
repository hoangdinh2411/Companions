import mongoose from 'mongoose';
import { ERROR_MESSAGES } from '../../lib/utils/error-messages';
import {
  CompanionInJourneyStatusEnum,
  JourneyDocument,
  JourneyStatusEnum,
} from '@repo/shared';

interface IJourneySchema extends JourneyDocument {}

const CompanionsSchema = new mongoose.Schema(
  {
    companion_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    id_number: {
      required: true,
      type: String,
    },
    phone: {
      required: true,
      type: String,
    },
    status: {
      type: String,
      default: CompanionInJourneyStatusEnum.PENDING,
      enum: CompanionInJourneyStatusEnum,
    },
  },
  {
    _id: false,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);
const JourneySchema = new mongoose.Schema<IJourneySchema>(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    seats: {
      type: Number,
      required: true,
      min: 1,
    },
    time: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      default: JourneyStatusEnum.ACTIVE,
      enum: JourneyStatusEnum,
    },
    created_by: {
      _id: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      id_number: {
        required: true,
        type: String,
      },
      phone: {
        required: true,
        type: String,
      },
    },
    companions: [CompanionsSchema],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);
JourneySchema.pre('save', async function (next) {
  const existing = await this.model('Journey').findOne({
    from: this.from,
    to: this.to,
    startDate: this.startDate,
    endDate: this.endDate,
  });
  if (existing) {
    next(new Error(ERROR_MESSAGES.JOURNEY.DUPLICATE_JOURNEY));
  }
  next();
});
JourneySchema.post(
  'save',
  { errorHandler: true },
  function (error: any, docs, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      next(new Error('Duplicate key error'));
    } else {
      next(error);
    }
  }
);

const JourneyModel = mongoose.model('Journey', JourneySchema);

export default JourneyModel;
