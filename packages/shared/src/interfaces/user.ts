import { UserRoleEnum, UserStatusEnum } from '../enums/user';
import { DeliveryOrderDocument } from './delivery-order';
import { JourneyDocument } from './journey';

export interface SignInFormData {
  email: string;
  password: string;
}
export interface UserDocument extends SignInFormData {
  _id: string;
  status: UserStatusEnum;
  role: UserRoleEnum;
  id_number: string;
  phone: string;
  created_at?: Date;
  updated_at?: Date;
  full_name: string;
  orders_placed: string[];
  orders_taken: string[];
  journeys_shared: string[];
  journeys_joined: string[];
}

export interface SignUpFormData extends SignInFormData {
  confirm_password: string;
}

export interface SignInAPIResponse {
  token: string;
  maxAge: number;
}

export interface GetUserAPIResponse
  extends Omit<
    UserDocument,
    'orders_placed' | 'orders_taken' | 'journeys_shared' | 'journeys_joined'
  > {
  total_orders_placed: number;
  total_orders_taken: number;
  total_journeys_shared: number;
  total_journeys_joined: number;
}
export interface ResponseWithPagination<T> {
  items: T[];
  pagination?: {
    total: number;
    pages: number;
  };
}
export interface HistoryAPIResponse
  extends ResponseWithPagination<JourneyDocument | DeliveryOrderDocument> {}
