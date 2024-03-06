import {
  GetUserAPIResponse,
  SignInAPIResponse,
  SignInFormData,
  SignUpFormData,
  UserDocument,
} from '@repo/shared';
import customFetch from './customFetch';
import APP_ROUTER from '../lib/config/router';

export const signIn = (formData: SignInFormData) => {
  return customFetch<SignInAPIResponse>('/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify(formData),
    cache: 'no-cache',
  });
};

export const signUp = (formData: SignUpFormData) => {
  return customFetch('/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify(formData),
    cache: 'no-cache',
  });
};

export const getUser = () => {
  return customFetch<GetUserAPIResponse>(
    '/user/profile',
    {
      method: 'GET',
      next: {
        tags: ['profile'],
      },
    },
    true
  );
};

export const verifyAccount = (verify_code: string, email: string) => {
  return customFetch('/auth/verify/' + verify_code + '/' + email, {
    method: 'GET',
    cache: 'no-cache',
  });
};
