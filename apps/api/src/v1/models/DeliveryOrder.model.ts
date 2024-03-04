import mongoose from 'mongoose';
import { ERROR_MESSAGES } from '../../lib/utils/error-messages';
import {
  CompanionStatusEnum,
  DeliverOrderDocument,
  DeliveryOrderStatusEnum,
  TypeOfCommodityEnum,
} from '@repo/shared';
import { generateSlugFrom } from '../../lib/utils/generate-slug';

interface IDeliveryOrderSchema extends DeliverOrderDocument {}

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
    full_name: {
      // required: true,
      type: String,
    },
    status: {
      type: String,
      default: CompanionStatusEnum.PENDING,
      enum: CompanionStatusEnum,
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
DeliveryOrderSchema.pre('save', async function (next) {
  const existing = await this.model('DeliveryOrder').findOne({
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

const DeliveryOrderModel = mongoose.model('DeliveryOrder', DeliveryOrderSchema);

export default DeliveryOrderModel;