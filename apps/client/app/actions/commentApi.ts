'use server';
import {
  CommentDocument,
  CommentFormData,
  ResponseWithPagination,
} from '@repo/shared';
import customFetch from './customFetch';
import { revalidateTag } from 'next/cache';

export const addNewComment = async (formData: CommentFormData) => {
  const res = await customFetch(
    '/comments',
    {
      method: 'POST',
      body: JSON.stringify(formData),
      cache: 'no-cache',
    },
    true
  );
  if (res.success) {
    revalidateTag('comments');
  }

  return res;
};

export const getNewestComments = async () => {
  return await customFetch<ResponseWithPagination<CommentDocument>>(
    '/comments',
    {
      method: 'GET',
      next: {
        revalidate: 60 * 60,
        tags: ['comments'],
      },
    }
  );
};
export const updateComment = async (
  comment_id: string,
  formData: CommentFormData
) => {
  const res = await customFetch(
    '/comments/' + comment_id,
    {
      method: 'PUT',
      body: JSON.stringify(formData),
      cache: 'no-cache',
    },
    true
  );
  if (res.success) {
    revalidateTag('comments');
  }

  return res;
};
export const deleteComment = async (comment_id: string) => {
  const res = await customFetch(
    `/comments/${comment_id}`,
    {
      method: 'DELETE',
      cache: 'no-cache',
    },
    true
  );
  if (res.success) {
    revalidateTag('comments');
  }

  return res;
};
