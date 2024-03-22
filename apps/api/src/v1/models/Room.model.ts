import { RoomDocument, RoomStatusEnum } from '@repo/shared';
import mongoose from 'mongoose';

interface IRoomSchema extends RoomDocument {}

const RoomSchema = new mongoose.Schema<IRoomSchema>(
  {
    room_name: {
      type: String,
      default: '',
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
      },
    ],
    leaved_users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
      },
    ],
    status: {
      type: String,
      default: RoomStatusEnum.ACTIVE,
      enum: RoomStatusEnum,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

const RoomModel = mongoose.model('Rooms', RoomSchema);

export default RoomModel;
