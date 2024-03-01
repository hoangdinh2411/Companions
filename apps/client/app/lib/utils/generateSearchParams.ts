export const generateSearchParams = (
  paramsRequired: string[],
  searchParams: {
    [key: string]: string | number;
  }
) => {
  const params = new URLSearchParams();
  paramsRequired.forEach((param) => {
    if (searchParams[param]) {
      params.append(param, searchParams[param].toString() || '');
    }
  });

  return params.toString();
};
