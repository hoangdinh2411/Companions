export const defaultResponseIfNoData = (
  data: {
    items: unknown[];
    pagination: {
      total: number;
      pages: number;
    };
  }[]
) => {
  const defaultResponse = {
    items: [],
    pagination: {
      total: 0,
      pages: 0,
    },
  };
  if (Array.isArray(data) && data.length === 0) {
    return defaultResponse;
  }
  if (data[0] && data[0]?.items.length === 0) {
    return defaultResponse;
  }

  return data[0];
};
