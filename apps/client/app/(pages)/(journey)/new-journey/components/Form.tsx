'use client';
import React, { useCallback, useEffect, useState, useTransition } from 'react';
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

export default function Form() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const idNumberRef = React.createRef<HTMLInputElement>();
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
        const formData = {
          ...values,
          price: Number(values.price),
          seats: Number(values.seats),
          id_number,
        };
        const res = await createNewJourney(formData);
        if (res.status === 401) {
          toast.error('You need to login to share your journey');

          return;
        }
        if (!res.success) {
          toast.error(res.message);
          return;
        }
        toast.success('Journey shared successfully');
        router.push(APP_ROUTER.JOURNEYS);
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
  const handleChangeIdNumber = async () => {
    if (!idNumberRef.current) return;
    if (idNumberRef.current?.value === '') {
      toast.error('Please enter your ID number');
      return;
    }
    startTransition(async () => {
      if (idNumberRef.current?.value) {
        await saveIdentifyNumber(idNumberRef.current?.value);
        toast.success('Logged in with BankID successfully');
        setOpen(false);
      }
    });
  };
  return (
    <>
      <form
        autoComplete='off'
        onSubmit={handleSubmit}
        className='new-journey__form'
      >
        <div className='new-journey__form__boxes'>
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
        <div className='new-journey__form__boxes'>
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
        <div className='new-journey__form__boxes'>
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
        <div className='new-journey__form__boxes'>
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
        <div className='new-journey__form__boxes'>
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
        <div className='new-journey__form__boxes price-box'>
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
        <div className='new-journey__form__boxes'>
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
        <div className='new-journey__form__boxes'>
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
        <div className='new-journey__form__boxes box-message'>
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
        <div className='new-journey__form__btn-box'>
          <Button variant='green' type='submit' loading={!open && isPending}>
            Share{' '}
          </Button>
        </div>
      </form>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className='identify-bank-id__container'>
          <h4>Bank Id</h4>
          <article>
            <strong>
              Note that identify with BankID is required to share your journey.
              We need to verify your identity to ensure the safety of our users.
            </strong>
            <p>
              <small>
                {' '}
                The BankID identification must be entered wih 12 digits :
                YYYYMMDD-NNNN
              </small>
            </p>
          </article>
          <form>
            <TextField
              label='ID Number'
              placeholder='YYYYMMDD-NNNN'
              name='id_number'
              ref={idNumberRef}
              type='tel'
              pattern='[0-9]{8}-[0-9]{4}'
              required
            />
            <Button
              type='button'
              onClick={handleChangeIdNumber}
              loading={open && isPending}
            >
              Identify with BankID
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
}
