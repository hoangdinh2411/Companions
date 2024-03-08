import mongoose from 'mongoose';
import { ERROR_MESSAGES } from '../../lib/utils/error-messages';
import { JourneyDocument, JourneyStatusEnum, UserDocument } from '@repo/shared';
import { generateSlugFrom } from '../../lib/utils/generate-slug';

interface IJourneySchema extends JourneyDocument {
  creator: UserDocument;
}

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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    companions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
      },
    ],
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
  const existing = await this.model('journeys').findOne({
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

const JourneyModel = mongoose.model('journeys', JourneySchema);

export default JourneyModel;
