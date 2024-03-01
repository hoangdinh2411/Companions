import * as yup from 'yup';

function formatDateWithoutTime(date: Date) {
  return (
    date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
  );
}

export const journeyFormDataValidation = yup.object().shape({
  title: yup
    .string()
    .required('Need to specify the title')
    .max(50, 'Title cannot be more than 50 characters'),
  from: yup.string().required('Need to specify the starting point'),
  to: yup.string().required('Need to specify the destination'),
  message: yup.string(),
  startDate: yup
    .date()
    .test('startDate', 'Start date cannot be less than today', (value) => {
      return formatDateWithoutTime(value) >= formatDateWithoutTime(new Date());
    })
    .required('Need to specify the start date'),
  endDate: yup
    .date()
    .test(
      'endDate',
      'End date cannot be less than start date',
      (value, context) => {
        return (
          formatDateWithoutTime(value) >=
          formatDateWithoutTime(context.parent.startDate)
        );
      }
    )
    .required('Need to specify the end date'),
  price: yup
    .number()
    .min(0, 'Price cannot be less than 0')
    .required('Need to specify the price'),
  seats: yup
    .number()
    .min(1, 'Seats cannot be less than 1')
    .required('Need to specify the number of seats'),
  time: yup.string().required('Need to specify the time'),
});

export const journeyRequestValidation = yup
  .object()
  .concat(journeyFormDataValidation)
  .shape({
    id_number: yup
      .string()
      .required('Need to specify the id number')
      .min(
        10,
        'ID number must be 10 digits : YYMMDD-XXXX or 12 digits : YYYYMMDD-XXXX'
      )
      .max(
        12,
        'ID number must be 10 digits : YYMMDD-XXXX or 12 digits : YYYYMMDD-XXXX'
      ),
    phone: yup
      .string()
      .required('Need to specify the phone number')
      .length(10, 'Phone number must be 10 digits'),
  });
