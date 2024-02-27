import {
  SignInAPIResponse,
  SignInFormData,
  SignUpFormData,
} from '@repo/shared';
import customFetch from './customFetch';

export const signIn = (formData: SignInFormData) => {
  return customFetch<SignInAPIResponse>('/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify(formData),
    cache: 'no-cache',
  });
};

export const signUp = async (formData: SignUpFormData) => {
  return customFetch('/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify(formData),
    cache: 'no-cache',
  });
};
