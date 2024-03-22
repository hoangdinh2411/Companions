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
    revalidatePath(APP_ROUTER.PROFILE);
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
    revalidateTag(`journey/${slug}`);
    revalidateTag(`journey/${id}`);
    revalidateTag('history');
    revalidatePath(APP_ROUTER.JOURNEYS, 'page');
  }
  return res;
};

export const getOneJourneyBySlug = async (slug = '') => {
  const res = await customFetch<JourneyDocument>(`/journeys/${slug}`, {
    method: 'GET',
    next: {
      tags: ['journey/' + slug],
    },
  });

  return res;
};
export const getOneJourneyById = async (id: string) => {
  const res = await customFetch<JourneyDocument>(
    `/journeys/id/${id}`,
    {
      method: 'GET',
      next: {
        tags: ['journey/' + id],
      },
    },
    true
  );

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
      revalidate: true,
      path: APP_ROUTER.JOURNEYS,
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
      method: 'PATCH',
      cache: 'no-cache',
    },
    true
  );

  if (res.success) {
    revalidateTag('journey/' + slug);
    revalidatePath(APP_ROUTER.PROFILE);
    revalidateTag('history');
  }
  return res;
};
export const updateStatusJourney = async (journey_id: string, slug: string) => {
  const res = await customFetch(
    `/journeys/${journey_id}`,
    {
      method: 'PATCH',
      cache: 'no-cache',
    },
    true
  );

  if (res.success) {
    revalidateTag('journey/' + slug);
    revalidatePath(APP_ROUTER.PROFILE);
    revalidateTag('history');
  }
  return res;
};
export const deleteJourney = async (journey_id: string, slug: string) => {
  const res = await customFetch(
    `/journeys/${journey_id}`,
    {
      method: 'DELETE',
      cache: 'no-cache',
    },
    true
  );

  if (res.success) {
    revalidateTag('journey/' + slug);
    revalidatePath(APP_ROUTER.PROFILE);
    revalidateTag('history');
  }
  return res;
};
