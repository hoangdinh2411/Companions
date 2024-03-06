import * as Yup from 'yup';
import { TypeOfCommodityEnum } from '../enums/delivery-order';

export const queryValidation = {
  search: Yup.object().shape({
    page: Yup.number().test('isInt', 'Page must be an integer', (value) => {
      if (!value) return true;
      return Number.isInteger(value);
    }),
    search_text: Yup.string().required('What are you searching for?'),
  }),
  filter: {
    shipping: Yup.object().shape({
      page: Yup.number().test('isInt', 'Page must be an integer', (value) => {
        if (!value) return true;
        return Number.isInteger(value);
      }),
      start_date: Yup.string()
        .test(
          'isDate',
          'Start date must be in the format YYYY-MM-DD',
          (value) => {
            if (!value) return true;
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            return regex.test(value);
          }
        )
        .required('When is the start date?'),
      from: Yup.string().required('Where are the goods coming from?'),
      to: Yup.string().required('where are the goods going to?'),
      type_of_commodity: Yup.string()
        .test(
          'isValidType',
          'Need to provide a valid type of commodity',
          (value) => {
            if (!value) return false;
            if (value === 'all') return true;
            const validTypes = Object.values(TypeOfCommodityEnum);
            return validTypes.includes(value as TypeOfCommodityEnum);
          }
        )
        .required('Type of commodity is required'),
    }),
    carpooling: Yup.object().shape({
      page: Yup.number().test('isInt', 'Page must be an integer', (value) => {
        if (!value) return true;
        return Number.isInteger(value);
      }),
      start_date: Yup.string()
        .test(
          'isDate',
          'Start date must be in the format YYYY-MM-DD',
          (value) => {
            if (!value) return true;
            const regex = /^\d{4}-\d{2}-\d{2}$/;
            return regex.test(value);
          }
        )
        .required('When is the start date?'),
      from: Yup.string().required('Where are the journey starting from?'),
      to: Yup.string().required("Where is the journey's destination?"),
    }),
  },
  getAll: Yup.object().shape({
    page: Yup.number().test('isInt', 'Page must be an integer', (value) => {
      if (!value) return true;
      return Number.isInteger(value);
    }),
  }),
};
