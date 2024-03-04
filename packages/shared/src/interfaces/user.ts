import { UserRoleEnum, UserStatusEnum } from '../enums/user';

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
  order_full_filled: string[];
  journeys_shared: string[];
  journeys_joined: string[];
}

export interface SignUpFormData extends SignInFormData {
  confirm_password: string;
}

export interface SignInAPIResponse {
  token: string;
}
