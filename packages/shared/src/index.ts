import { UserEnum, UserStatusEnum, UserRoleEnum } from './enums/user';
import {
  UserDocument,
  SignInAPIResponse,
  SignInFormData,
  SignUpFormData,
} from './interfaces/user';
import {
  signInValidation,
  signUpValidation,
} from './validation/userValidation';

import {
  journeyFormDataValidation,
  journeyRequestValidation,
} from './validation/journeyValidation';

import { queryValidation } from './validation/queryValidation';
import {
  JourneyDocument,
  JourneyFormData,
  JourneyResponse,
} from './interfaces/journey';
import {
  JourneyStatusEnum,
  CompanionInJourneyStatusEnum,
} from './enums/journey';

export {
  signInValidation,
  signUpValidation,
  journeyFormDataValidation,
  journeyRequestValidation,
  queryValidation,
};
export {
  UserEnum,
  UserStatusEnum,
  UserRoleEnum,
  JourneyStatusEnum,
  CompanionInJourneyStatusEnum,
};

//User
export type { UserDocument, SignInAPIResponse, SignInFormData, SignUpFormData };

//Journey
export type { JourneyDocument, JourneyResponse, JourneyFormData };
