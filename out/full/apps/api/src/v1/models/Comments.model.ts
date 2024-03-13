import { CommentDocument } from '@repo/shared';
import mongoose from 'mongoose';

interface ICommentSchema extends CommentDocument {}

const CommentSchema = new mongoose.Schema<ICommentSchema>(
  {
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

const CommentModel = mongoose.model('Comments', CommentSchema);

export default CommentModel;
