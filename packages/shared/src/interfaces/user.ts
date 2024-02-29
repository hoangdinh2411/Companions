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
}

export interface SignUpFormData extends SignInFormData {
  confirm_password: string;
}

export interface SignInAPIResponse {
  token: string;
}
