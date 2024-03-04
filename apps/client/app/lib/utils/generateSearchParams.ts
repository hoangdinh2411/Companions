export const generateSearchParams = (
  paramsRequired: string[],
  searchParams: Record<string, string>
) => {
  const params = new URLSearchParams();
  paramsRequired.forEach((param) => {
    if (searchParams[param]) {
      params.append(param, searchParams[param].toString() || '');
    }
  });

  return params.toString();
};
