import { UserRoleEnum, UserStatusEnum } from '../enums/user';

export interface UserType {
  email: string;
  password: string;
  status?: UserStatusEnum;
  role?: UserRoleEnum;
}

export interface SignInFormData {
  email: string;
  password: string;
}
export interface SignUpFormData extends SignInFormData {
  confirm_password: string;
}

export interface SignInAPIResponse {
  token: string;
}
