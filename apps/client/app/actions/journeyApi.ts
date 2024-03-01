'use server';
import { JourneyFormData, JourneyResponse } from '@repo/shared';
import customFetch from './customFetch';
import { revalidatePath, revalidateTag } from 'next/cache';
import APP_ROUTER from '../lib/config/router';

export const createNewJourney = async (formData: JourneyFormData) => {
  const res = await customFetch(
    '/journeys',
    {
      method: 'POST',
      body: JSON.stringify(formData),
    },
    true
  );
  if (res.success) {
    revalidatePath(APP_ROUTER.JOURNEYS);
  }
  return res;
};

export const getAllJourneys = async (query = '') => {
  let url = `/journeys`;
  if (query) {
    url += `?${query}`;
  }
  const res = await customFetch<JourneyResponse>(url, {
    method: 'GET',
    next: {
      revalidatePath: APP_ROUTER.JOURNEYS,
    },
  });

  return res;
};

export const filterJourneys = async (query: string) => {
  if (!query) new Error('Query is required');
  const res = await customFetch<JourneyResponse>(`/journeys/filter?${query}`, {
    method: 'GET',
    next: {
      revalidateTags: [`/journeys/filter?${query}`],
    },
  });

  return res;
};

export const searchJourneys = async (query: string) => {
  const res = await customFetch<JourneyResponse>(`/journeys/search?${query}`, {
    method: 'GET',
    next: {
      revalidateTags: [`/journeys/search?${query}`],
    },
  });

  return res;
};
