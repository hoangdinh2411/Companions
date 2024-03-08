'use server';
import {
  JourneyDocument,
  JourneyFormData,
  ResponseWithPagination,
} from '@repo/shared';
import customFetch from './customFetch';
import { revalidatePath, revalidateTag } from 'next/cache';
import APP_ROUTER from '../lib/config/router';

export const createNewJourney = async (formData: JourneyFormData) => {
  const res = await customFetch(
    '/journeys',
    {
      method: 'POST',
      body: JSON.stringify(formData),
      cache: 'no-cache',
    },
    true
  );
  if (res.success) {
    revalidatePath(APP_ROUTER.JOURNEYS, 'page');
    revalidateTag('history');
  }
  return res;
};
export const modifyJourney = async (
  id: string,
  slug: string,
  formData: JourneyFormData
) => {
  const res = await customFetch(
    '/journeys/' + id,
    {
      method: 'PUT',
      body: JSON.stringify(formData),
      cache: 'no-cache',
    },
    true
  );
  if (res.success) {
    revalidatePath(`${APP_ROUTER.JOURNEYS}/${slug}`, 'page');
  }
  return res;
};

export const getOneJourneyBySlug = async (slug = '') => {
  const res = await customFetch<JourneyDocument>(`/journeys/${slug}`, {
    method: 'GET',
    next: {
      path: APP_ROUTER.JOURNEYS + '/' + slug,
    },
  });

  return res;
};
export const getAllJourneys = async (query = '') => {
  let url = `/journeys`;
  if (query) {
    url += `?${query}`;
  }
  const res = await customFetch<ResponseWithPagination<JourneyDocument>>(url, {
    method: 'GET',
    next: {
      revalidatePath: APP_ROUTER.JOURNEYS,
    },
  });

  return res;
};

export const filterJourneys = async (query: string) => {
  if (!query) new Error('Query is required');
  const res = await customFetch<ResponseWithPagination<JourneyDocument>>(
    `/journeys/filter?${query}`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );

  return res;
};

export const searchJourneys = async (query: string) => {
  const res = await customFetch<ResponseWithPagination<JourneyDocument>>(
    `/journeys/search?${query}`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );

  return res;
};

export const joinJourney = async (journey_id: string, slug: string) => {
  const res = await customFetch(
    `/journeys/${journey_id}/join`,
    {
      method: 'PUT',
      cache: 'no-cache',
    },
    true
  );

  if (res.success) {
    revalidatePath(APP_ROUTER.JOURNEYS + '/' + slug);
    revalidatePath(APP_ROUTER.PROFILE);
    revalidateTag('history');
  }
  return res;
};
