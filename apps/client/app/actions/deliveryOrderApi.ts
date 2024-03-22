'use server';
import {
  DeliveryOrderDocument,
  DeliveryOrderFormData,
  ResponseWithPagination,
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
    revalidatePath(APP_ROUTER.PROFILE);
    revalidateTag('history');
  }
  return res;
};
export const modifyOrder = async (
  order_id: string,
  slug: string,
  formData: DeliveryOrderFormData
) => {
  const res = await customFetch(
    '/delivery-orders/' + order_id,
    {
      method: 'PUT',
      body: JSON.stringify(formData),
    },
    true
  );
  if (res.success) {
    revalidateTag(`order/${slug}`);
    revalidateTag(`order/${order_id}`);
    revalidateTag('history');
    revalidatePath(APP_ROUTER.DELIVERY_ORDERS, 'page');
  }
  return res;
};

export const getOneDeliveryOrderBySlug = async (slug = '') => {
  const res = await customFetch<DeliveryOrderDocument>(
    `/delivery-orders/${slug}`,
    {
      method: 'GET',
      next: {
        tags: ['order/' + slug],
      },
    }
  );

  return res;
};
export const getOneDeliveryOrderById = async (id = '') => {
  const res = await customFetch<DeliveryOrderDocument>(
    `/delivery-orders/id/${id}`,
    {
      method: 'GET',
      next: {
        tags: ['order/' + id],
      },
    },
    true
  );

  return res;
};
export const getAllDeliveryOrder = async (query = '') => {
  let url = `/delivery-orders`;
  if (query) {
    url += `?${query}`;
  }
  const res = await customFetch<ResponseWithPagination<DeliveryOrderDocument>>(
    url,
    {
      method: 'GET',
      next: {
        revalidate: 60 * 60 * 8,
        path: APP_ROUTER.DELIVERY_ORDERS,
      },
    }
  );

  return res;
};

export const filterDeliveryOrder = async (query: string) => {
  if (!query) new Error('Query is required');
  const res = await customFetch<ResponseWithPagination<DeliveryOrderDocument>>(
    `/delivery-orders/filter?${query}`,
    {
      method: 'GET',
      cache: 'no-cache',
    }
  );

  return res;
};

export const searchDeliveryOrder = async (query: string) => {
  const res = await customFetch<ResponseWithPagination<DeliveryOrderDocument>>(
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
    `/delivery-orders/${order_id}/take`,
    {
      method: 'PATCH',
      cache: 'no-cache',
    },
    true
  );
  if (res.success) {
    revalidateTag(`order/${slug}`);
    revalidateTag('history');
    revalidatePath(APP_ROUTER.PROFILE);
  }
  return res;
};
export const updateStatusOrder = async (order_id: string, slug: string) => {
  const res = await customFetch(
    `/delivery-orders/${order_id}`,
    {
      method: 'PATCH',
      cache: 'no-cache',
    },
    true
  );
  if (res.success) {
    revalidateTag(`order/${slug}`);
    revalidateTag('history');
    revalidatePath(APP_ROUTER.PROFILE);
  }

  return res;
};
export const deleteOrder = async (order_id: string, slug: string) => {
  const res = await customFetch(
    `/delivery-orders/${order_id}`,
    {
      method: 'DELETE',
      cache: 'no-cache',
    },
    true
  );
  if (res.success) {
    revalidateTag(`order/${slug}`);
    revalidateTag('history');
    revalidatePath(APP_ROUTER.PROFILE);
  }

  return res;
};
