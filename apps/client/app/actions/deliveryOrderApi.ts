'use server';
import {
  DeliverOrderDocument,
  DeliverOrderResponse,
  DeliveryOrderFormData,
  JourneyDocument,
  JourneyFormData,
  JourneyResponse,
} from '@repo/shared';
import customFetch from './customFetch';
import { revalidatePath, revalidateTag } from 'next/cache';
import APP_ROUTER from '../lib/config/router';

export const createNewOrder = async (formData: DeliveryOrderFormData) => {
  const res = await customFetch(
    '/delivery-orders',
    {
      method: 'POST',
      body: JSON.stringify(formData),
    },
    true
  );
  if (res.success) {
    revalidatePath(APP_ROUTER.DELIVERY_ORDERS, 'page');
  }
  return res;
};

export const getOneDeliveryOrBySlug = async (slug = '') => {
  const res = await customFetch<DeliverOrderDocument>(
    `/delivery-orders/${slug}`,
    {
      method: 'GET',
      next: {
        tags: [`/delivery-orders/${slug}`],
      },
    }
  );

  return res;
};
export const getAllDeliveryOrder = async (query = '') => {
  let url = `/delivery-orders`;
  if (query) {
    url += `?${query}`;
  }
  const res = await customFetch<DeliverOrderResponse>(url, {
    method: 'GET',
    next: {
      revalidatePath: APP_ROUTER.DELIVERY_ORDERS,
    },
  });

  return res;
};

export const filterDeliveryOrder = async (query: string) => {
  if (!query) new Error('Query is required');
  const res = await customFetch<DeliverOrderResponse>(
    `/delivery-orders/filter?${query}`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );

  return res;
};

export const searchDeliveryOrder = async (query: string) => {
  const res = await customFetch<DeliverOrderResponse>(
    `/delivery-orders/search?${query}`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );

  return res;
};
