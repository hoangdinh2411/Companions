import mongoose from 'mongoose';
import { ERROR_MESSAGES } from '../../lib/utils/error-messages';
import { JourneyDocument, JourneyStatusEnum } from '@repo/shared';
import { generateSlugFrom } from '../../lib/utils/generate-slug';

interface IJourneySchema extends JourneyDocument {}

const CompanionsSchema = new mongoose.Schema(
  {
    companion_id: {
      type: String,
      required: true,
    },
    full_name: {
      type: String,
      required: true,
    },
    id_number: {
      required: true,
      type: String,
      unique: true,
    },
    phone: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);
const JourneySchema = new mongoose.Schema<IJourneySchema>(
  {
    title: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    start_date: {
      type: String,
      required: true,
    },
    end_date: {
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

    be_in_touch: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      default: JourneyStatusEnum.ACTIVE,
      enum: JourneyStatusEnum,
    },
    slug: {
      type: String,
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
        type: String,
      },
      phone: {
        required: true,
        type: String,
      },
      full_name: {
        type: String,
        required: true,
      },
    },
    companions: [CompanionsSchema],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    autoIndex: true,
  }
);

JourneySchema.index({ from: 1, to: 1, start_date: 1, title: 1 });
JourneySchema.pre('save', async function (next) {
  const existing = await this.model('Journey').findOne({
    start_date: this.start_date,
    end_date: this.end_date,
    created_by: {
      _id: this.created_by?._id,
    },
  });
  if (existing) {
    next(new Error(ERROR_MESSAGES.JOURNEY.DUPLICATE_JOURNEY));
  }

  this.slug = generateSlugFrom(
    this.title,
    this.from,
    this.to,
    this.start_date,
    this.end_date
  );
  next();
});
JourneySchema.post(
  'save',
  { errorHandler: true },
  function (error: any, _, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      next(new Error('Duplicate key error'));
    } else {
      next(error);
    }
  }
);

const JourneyModel = mongoose.model('Journey', JourneySchema);

export default JourneyModel;
