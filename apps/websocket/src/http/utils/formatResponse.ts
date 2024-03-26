import { ResponseWithPagination } from '@repo/shared';

export const defaultResponseWithPaginationIfNoData = (
  data: ResponseWithPagination<unknown>[]
) => {
  const defaultResponse = {
    items: [],
    pagination: {
      total: 0,
      pages: 0,
    },
  };
  if (!data) return defaultResponse;
  if (Array.isArray(data) && data.length === 0) {
    return defaultResponse;
  }
  if (data[0] && data[0]?.items.length === 0) {
    return defaultResponse;
  }

  return data[0];
};
