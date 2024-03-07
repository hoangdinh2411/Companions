'use server';
import {
  DeliveryOrderDocument,
  DeliveryOrderResponse,
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
    revalidateTag('history');
  }
  return res;
};

export const getOneDeliveryOrderBySlug = async (slug = '') => {
  const res = await customFetch<DeliveryOrderDocument>(
    `/delivery-orders/${slug}`,
    {
      method: 'GET',
      next: {
        path: APP_ROUTER.DELIVERY_ORDERS + '/' + slug,
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
  const res = await customFetch<DeliveryOrderResponse>(url, {
    method: 'GET',
    next: {
      path: APP_ROUTER.DELIVERY_ORDERS,
    },
  });

  return res;
};

export const filterDeliveryOrder = async (query: string) => {
  if (!query) new Error('Query is required');
  const res = await customFetch<DeliveryOrderResponse>(
    `/delivery-orders/filter?${query}`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );

  return res;
};

export const searchDeliveryOrder = async (query: string) => {
  const res = await customFetch<DeliveryOrderResponse>(
    `/delivery-orders/search?${query}`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );

  return res;
};
export const takeOrder = async (order_id: string, slug: string) => {
  const res = await customFetch(
    `/delivery-orders/take/${order_id}`,
    {
      method: 'PUT',
      cache: 'no-cache',
    },
    true
  );
  if (res.success) {
    revalidatePath(APP_ROUTER.DELIVERY_ORDERS + '/' + slug);
    revalidateTag('profile');
    revalidateTag('history');
  }
  return res;
};
