'use client';
import React, { ComponentProps, FC, useTransition } from 'react';
import TextField from '../../../UI/TextField';
import Button from '../../../UI/Button';
import DatePicker from '../../../UI/DatePicker/DatePicker';
import { useFormik } from 'formik';
import {
  JourneyDocument,
  JourneyFormData,
  journeyFormDataValidation,
} from '@repo/shared';
import {
  createNewJourney,
  modifyJourney,
} from '../../../../actions/journeyApi';
import { getIdentifyNumber } from '../../../../actions/tokens';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import APP_ROUTER from '../../../../lib/config/router';
import dayjs from 'dayjs';
import './JourneyForm.scss';

let initialValues = {
  from: '',
  to: '',
  start_date: new Date(),
  end_date: new Date(),
  seats: '',
  price: '',
  message: '',
  time: '',
  title: '',
  be_in_touch: true,
};

interface JourneyFormProps extends ComponentProps<'div'> {
  journey?: JourneyDocument;
  heading: string;
}
const JourneyForm: FC<JourneyFormProps> = ({ journey, heading }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  if (journey?._id) {
    initialValues = {
      from: journey.from,
      to: journey.to,
      start_date: new Date(journey.start_date),
      end_date: new Date(journey.end_date),
      seats: journey.seats.toString(),
      price: journey.price.toString(),
      message: journey.message,
      time: journey.time,
      title: journey.title,
      be_in_touch: journey.be_in_touch || true,
    };
  }

  async function handleAddNewJourney(formData: JourneyFormData) {
    const res = await createNewJourney(formData);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success('Journey shared successfully');
    router.push(APP_ROUTER.JOURNEYS);
  }

  async function handleModifyJourney(formData: JourneyFormData) {
    if (!journey) return;
    const res = await modifyJourney(journey._id, journey.slug, formData);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success('Journey modified successfully');
    router.back();
  }
  const formik = useFormik({
    initialValues,
    validateOnBlur: false,
    validationSchema: journeyFormDataValidation,
    onSubmit: (values) => {
      startTransition(async () => {
        const id_number = await getIdentifyNumber();
        if (!id_number) {
          router.push(APP_ROUTER.IDENTIFY);
          return;
        }

        const formData = {
          ...values,
          price: Number(values.price),
          seats: Number(values.seats),
          start_date: dayjs(values.start_date).format('YYYY-MM-DD'),
          end_date: dayjs(values.end_date).format('YYYY-MM-DD'),
        };
        if (!journey?._id) {
          await handleAddNewJourney(formData);
        } else {
          await handleModifyJourney(formData);
        }
      });
    },
  });
  const {
    handleSubmit,
    handleChange,
    values,
    errors,
    setFieldValue,
    handleBlur,
    touched,
  } = formik;

  const buttonContent = journey?._id ? 'Modify Journey' : 'Share Journey';
  return (
    <div className='journey'>
      <div className='journey__container'>
        <h3>{heading}</h3>
        <form
          autoComplete='off'
          onSubmit={handleSubmit}
          className='journey__form'
        >
          <div className='journey__form__boxes'>
            <TextField
              required
              label='Title (max 50 characters)'
              type='text'
              id='title'
              name='title'
              max={50}
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.title && touched.title)}
              message={touched.title && errors.title}
              placeholder='Please enter the title of your journey'
            />
          </div>
          <div className='journey__form__boxes'>
            <TextField
              required
              label='From'
              type='text'
              id='from'
              name='from'
              value={values.from}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.from && touched.from)}
              message={touched.from && errors.from}
              placeholder='Please enter your location'
            />
          </div>
          <div className='journey__form__boxes'>
            <TextField
              required
              label='To'
              type='text'
              id='to'
              name='to'
              value={values.to}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(errors.to && touched.to)}
              message={touched.to && errors.to}
              placeholder='Please enter your destination'
            />
          </div>
          <div className='journey__form__boxes'>
            <DatePicker
              label='Start date'
              id='start-date'
              required
              error={Boolean(errors.start_date)}
              message={errors.start_date}
              selected={values.start_date}
              handleSelect={(date) => setFieldValue('start_date', date)}
            />
          </div>
          <div className='journey__form__boxes'>
            <DatePicker
              label='End date'
              id='end-date'
              required
              className='boxes'
              selected={values.end_date}
              handleSelect={(date) => {
                setFieldValue('end_date', date);
              }}
              error={Boolean(errors.end_date)}
              message={errors.end_date}
            />
          </div>
          <div className='journey__form__boxes'>
            <TextField
              required
              label='Seats'
              type='text'
              id='seats'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.seats}
              error={Boolean(errors.seats && touched.seats)}
              message={touched.seats && errors.seats}
              name='seats'
              placeholder='Please enter the number of seats'
            />
          </div>
          <div className='journey__form__boxes price-box'>
            <TextField
              required
              label='Price'
              type='tel'
              id='price'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.price}
              error={Boolean(errors.price && touched.price)}
              message={touched.price && errors.price}
              name='price'
              placeholder='Please enter the price'
            />
            <span>SEK</span>
          </div>
          <div className='journey__form__boxes'>
            <TextField
              required
              label='Time'
              type='time'
              id='time'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.time}
              error={Boolean(errors.time && touched.time)}
              message={touched.time && errors.time}
              name='time'
            />
          </div>
          <div className='journey__form__boxes box-message'>
            <label htmlFor='message'>
              <p>Message: (optional)</p>
            </label>
            <textarea
              id='message'
              name='message'
              value={values.message}
              onChange={handleChange}
              rows={5}
              cols={50}
              placeholder='Please enter the message '
            ></textarea>
          </div>
          <div className='journey__form__boxes be-in-touch'>
            <input
              type='checkbox'
              name='be_in_touch'
              id='be_in_touch'
              checked={values.be_in_touch}
              onChange={handleChange}
            />
            <label htmlFor='be_in_touch'>
              Will you be in touch with other users who join this journey with
              you? If this checkbox is ticked, nobody can see your contact
              details
            </label>
          </div>
          <div className='journey__form__btn-box'>
            <Button variant='green' type='submit' loading={isPending}>
              {buttonContent}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JourneyForm;
