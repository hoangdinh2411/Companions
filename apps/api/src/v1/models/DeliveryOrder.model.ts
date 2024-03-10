import mongoose from 'mongoose';
import { ERROR_MESSAGES } from '../../lib/utils/error-messages';
import {
  DeliveryOrderDocument,
  DeliveryOrderStatusEnum,
  TypeOfCommodityEnum,
} from '@repo/shared';
import { generateSlugFrom } from '../../lib/utils/generate-slug';

interface IDeliveryOrderSchema extends DeliveryOrderDocument {}

const DeliveryOrderSchema = new mongoose.Schema<IDeliveryOrderSchema>(
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
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    size: {
      type: String,
    },
    be_in_touch: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      default: DeliveryOrderStatusEnum.ACTIVE,
      enum: DeliveryOrderStatusEnum,
    },
    slug: {
      type: String,
    },
    type_of_commodity: {
      type: String,
      required: true,
      enum: TypeOfCommodityEnum,
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

DeliveryOrderSchema.virtual('creator');
DeliveryOrderSchema.index({
  from: 1,
  to: 1,
  start_date: 1,
  title: 1,
  type_of_commodity: 1,
});
DeliveryOrderSchema.pre('save', async function (next) {
  const existing = await this.model('deliveryorders').findOne({
    from: this.from,
    to: this.to,
    start_date: this.start_date,
    end_date: this.end_date,
    created_by: {
      _id: this.created_by?._id,
    },
    type_of_commodity: this.type_of_commodity,
  });
  if (existing) {
    next(new Error(ERROR_MESSAGES.DELIVERY_ORDER.DUPLICATE_DELIVERY_ORDER));
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
DeliveryOrderSchema.post(
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

const DeliveryOrderModel = mongoose.model(
  'deliveryorders',
  DeliveryOrderSchema
);

export default DeliveryOrderModel;
