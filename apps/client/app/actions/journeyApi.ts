'use server';
import { JourneyFormData } from '@repo/shared';
import customFetch, { IResponse } from './customFetch';
import { revalidatePath } from 'next/cache';

export const createNewJourney = async (formData: JourneyFormData) => {
  const res = await customFetch('/journey', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
  if (res.success) {
    revalidatePath('/journey');
  }
  return res;
};
