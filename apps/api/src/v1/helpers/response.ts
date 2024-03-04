export const defaultResponseIfNoData = (data: any) => {
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
