import { RoomStatusEnum } from '../enums/room';
import { MessageDocument } from './message';
import { UserDocument } from './user';

export interface RoomDocument {
  _id: string;
  room_name: string;
  created_at: Date;
  updated_at: Date;
  users: UserDocument[];
  leaved_users: UserDocument[];
  status: RoomStatusEnum;
  __v: number;
}

export interface IRoom extends RoomDocument {
  messages: MessageDocument[];
}
