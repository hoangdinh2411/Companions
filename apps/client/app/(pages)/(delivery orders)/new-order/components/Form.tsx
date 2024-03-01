'use client';
import React, { useState, useTransition } from 'react';
import TextField from '../../../../components/UI/TextField';
import Button from '../../../../components/UI/Button';
import DatePicker from '../../../../components/UI/DatePicker/DatePicker';
import { useFormik } from 'formik';
import { journeyFormDataValidation } from '@repo/shared';
import { createNewJourney } from '../../../../actions/journeyApi';
import Modal from '../../../../components/UI/Modal';
import {
  getIdentifyNumber,
  saveIdentifyNumber,
} from '../../../../actions/tokens';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import APP_ROUTER from '../../../../lib/config/router';
import dayjs from 'dayjs';
import BankIDForm from '../../../../components/shared/Modals/BankIDForm';

export default function Form() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const formik = useFormik({
    initialValues: {
      from: '',
      to: '',
      startDate: new Date(),
      endDate: new Date(),
      seats: '',
      price: '',
      message: '',
      time: '',
      phone: '',
      title: '',
    },
    validateOnBlur: false,
    validationSchema: journeyFormDataValidation,
    onSubmit: (values) => {
      startTransition(async () => {
        const id_number = await getIdentifyNumber();
        if (!id_number) {
          setOpen(true);
          return;
        }
        // const formData = {
        //   ...values,
        //   price: Number(values.price),
        //   seats: Number(values.seats),
        //   startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
        //   endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
        //   id_number,
        // };
        // const res = await createNewJourney(formData);
        // if (res.status === 401) {
        //   toast.error('You need to login to share your journey');

        //   return;
        // }
        // if (!res.success) {
        //   toast.error(res.message);
        //   return;
        // }
        // toast.success('Journey shared successfully');
        // router.push(APP_ROUTER.DELIVERY_ORDERS);
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
  const handleSignInByBankId = async (id_number: string) => {
    startTransition(async () => {
      if (id_number) {
        await saveIdentifyNumber(id_number);
        setFieldValue('id_number', id_number);
        setOpen(false);
      }
    });
  };

  const handelCloseModal = () => {
    setOpen(false);
  };
  return (
    <>
      <form
        autoComplete='off'
        onSubmit={handleSubmit}
        className='new-order__form'
      >
        <div className='new-order__form__boxes'>
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
        <div className='new-order__form__boxes'>
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
        <div className='new-order__form__boxes'>
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
        <div className='new-order__form__boxes'>
          <DatePicker
            label='Start date'
            id='start-date'
            required
            error={Boolean(errors.startDate)}
            message={errors.startDate}
            selected={values.startDate}
            handleSelect={(date) => setFieldValue('startDate', date)}
          />
        </div>
        <div className='new-order__form__boxes'>
          <DatePicker
            label='End date'
            id='end-date'
            required
            className='boxes'
            selected={values.endDate}
            handleSelect={(date) => {
              setFieldValue('endDate', date);
            }}
            error={Boolean(errors.endDate)}
            message={errors.endDate}
          />
        </div>
        <div className='new-order__form__boxes'>
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
        <div className='new-order__form__boxes price-box'>
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
        <div className='new-order__form__boxes'>
          <TextField
            required
            label='Phone Number'
            type='tel'
            id='phone'
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.phone}
            error={Boolean(errors.phone && touched.phone)}
            message={touched.phone && errors.phone}
            name='phone'
            placeholder='Please enter phone number'
          />
        </div>
        <div className='new-order__form__boxes'>
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
        <div className='new-order__form__boxes box-message'>
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
        <div className='new-order__form__btn-box'>
          <Button variant='green' type='submit' loading={!open && isPending}>
            Share{' '}
          </Button>
        </div>
      </form>
      <Modal open={open} onClose={handelCloseModal}>
        <BankIDForm
          loading={open && isPending}
          handleSignInByBankId={handleSignInByBankId}
          closeModal={handelCloseModal}
        />
      </Modal>
    </>
  );
}
