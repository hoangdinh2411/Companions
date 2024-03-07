export const generateSearchParams = (
  paramsRequired: string[],
  searchParams: Record<string, string>
) => {
  const params = new URLSearchParams();
  paramsRequired.forEach((param) => {
    if ((param === 'page' && !searchParams.page) || searchParams.page === '0') {
      params.append('page', '1');
      return;
    }
    if (searchParams[param]) {
      params.append(param, searchParams[param].toString() || '');
    }
  });

  return params.toString();
};
