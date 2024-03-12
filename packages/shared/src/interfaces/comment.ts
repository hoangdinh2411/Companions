import { UserDocument } from './user';

export interface CommentFormData {
  content: string;
}

export interface CommentDocument extends CommentFormData {
  _id: string;
  created_by: UserDocument;
  created_at: string;
  updated_at: string;
}
