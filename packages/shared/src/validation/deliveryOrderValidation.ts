import * as yup from 'yup';
import dayjs = require('dayjs');
import { TypeOfCommodityEnum } from '../enums/delivery-order';

export const deliveryOrderFormDataValidation = yup.object().shape({
  title: yup
    .string()
    .required('Need to specify the title')
    .max(50, 'Title cannot be more than 50 characters'),
  from: yup.string().required('Need to specify the starting point'),
  to: yup.string().required('Need to specify the destination'),
  message: yup.string(),
  start_date: yup
    .date()
    .test(
      'start_date',
      'Start date cannot be less than today',
      (start_date) => {
        return (
          dayjs(start_date).format('YYYY-MM-DD') >= dayjs().format('YYYY-MM-DD')
        );
      }
    )
    .required('Need to specify the start date'),
  end_date: yup
    .date()
    .test(
      'end_date',
      'End date cannot be less than start date',
      (end_date, context) => {
        return (
          dayjs(end_date).format('YYYY-MM-DD') >=
          dayjs(context.parent.start_date).format('YYYY-MM-DD')
        );
      }
    )
    .required('Need to specify the end date'),

  price: yup
    .number()
    .min(0, 'Price cannot be less than 0')
    .required('Need to specify the price'),
  weight: yup
    .number()
    .positive('Weight cannot be less than 0')
    .required('Need to specify the weight'),
  type_of_commodity: yup
    .string()
    .required('Need to specify the type of commodity'),
  size: yup.string(),
  be_in_touch: yup
    .boolean()
    .test(
      'isBoolean',
      'Need to specify if you want to be in touch',
      (value) => {
        return typeof value === 'boolean';
      }
    )
    .required('Need to specify if you want to be in touch'),
});

export const deliveryOrderRequestValidation = yup
  .object()
  .concat(deliveryOrderFormDataValidation)
  .shape({
    phone: yup
      .string()
      .required('Need to specify the phone number')
      .length(10, 'Phone number must be 10 digits'),
  });
