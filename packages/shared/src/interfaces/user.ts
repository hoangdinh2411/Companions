import { UserRoleEnum, UserStatusEnum } from '../enums/user';

export interface UserType {
  email: string;
  password: string;
  status?: UserStatusEnum;
  role?: UserRoleEnum;
}
