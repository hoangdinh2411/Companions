import { MessageDocument, MessageStatusEnum } from '@repo/shared';
import mongoose from 'mongoose';

interface IMessageSchema extends MessageDocument {}

const MessageSchema = new mongoose.Schema<IMessageSchema>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rooms',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: MessageStatusEnum,
      default: MessageStatusEnum.SENDING,
    },
    seen_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

const MessageModel = mongoose.model('Messages', MessageSchema);

export default MessageModel;
