import * as yup from 'yup';

export const journeyValidation = yup.object().shape({
  from: yup.string().required('Need to specify the starting point'),
  to: yup.string().required('Need to specify the destination'),
  message: yup.string(),
  startDate: yup.string().required('Need to specify the start date'),
  endDate: yup.string().required('Need to specify the end date'),
  price: yup.number().required('Need to specify the price'),
  places: yup.number().required('Need to specify the number of places'),
  time: yup.string().required('Need to specify the time'),
  id_number: yup.string().required('Need to specify the ID number'),
  phone: yup.string().required('Need to specify the phone number'),
});
