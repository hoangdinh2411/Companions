import * as Yup from 'yup';

function isNotEmpty(value: string | undefined) {
  if (value === undefined) return true;
  return value.trim() !== '';
}
export const queryValidation = Yup.object().shape({
  page: Yup.number().test('isInt', 'Page must be an integer', (value) => {
    if (!value) return true;
    return Number.isInteger(value);
  }),
  limit: Yup.number().test('isInt', 'Limit must be an integer', (value) => {
    if (!value) return true;
    return Number.isInteger(value);
  }),
  startDate: Yup.string().test(
    'isDate',
    'Start date must be in the format YYYY-MM-DD',
    (value) => {
      if (!value) return true;
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      return regex.test(value);
    }
  ),
  from: Yup.string().test('isNotEmpty', 'Need to provide "From?"', (value) =>
    isNotEmpty(value)
  ),
  to: Yup.string().test('isNotEmpty', 'Need to provide "To?"', (value) =>
    isNotEmpty(value)
  ),
  searchText: Yup.string().test(
    'isNotEmpty',
    'Need to provide "Search Text?"',
    (value) => isNotEmpty(value)
  ),
});
