export const defaultResponseIfNoData = (data: unknown[]) => {
  return data.length === 0
    ? {
        items: [],
        pagination: {
          total: 0,
          pages: 0,
        },
      }
    : data[0];
};
