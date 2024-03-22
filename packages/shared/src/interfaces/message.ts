import { MessageStatusEnum } from '../enums/message';
import { RoomDocument } from './room';
import { UserDocument } from './user';

export interface MessageDocument {
  content: string;
  sender: UserDocument;
  room: RoomDocument;
  created_at: Date;
  updated_at: Date;
  status: MessageStatusEnum;
  _id: string;
  seen_by: UserDocument;
}
