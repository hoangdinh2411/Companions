'use client';
import React, { useState, useTransition } from 'react';
import TextField from '../../../../components/UI/TextField';
import Button from '../../../../components/UI/Button';
import DatePicker from '../../../../components/UI/DatePicker/DatePicker';
import { useFormik } from 'formik';
import {
  TypeOfCommodityEnum,
  deliveryOrderFormDataValidation,
} from '@repo/shared';
import Modal from '../../../../components/UI/Modal';
import { saveIdentifyNumber } from '../../../../actions/tokens';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import APP_ROUTER from '../../../../lib/config/router';
import dayjs from 'dayjs';
import BankIDForm from '../../../../components/shared/Modals/BankIDForm';
import Select from '../../../../components/UI/Select';
import { typeOfCommodityOptions } from '../../../../lib/config/variables';
import { createNewOrder } from '../../../../actions/deliveryOrderApi';

export default function Form() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const formik = useFormik({
    initialValues: {
      from: '',
      to: '',
      start_date: new Date(),
      end_date: new Date(),
      weight: '',
      size: '',
      price: '',
      message: '',
      type_of_commodity: '' as TypeOfCommodityEnum,
      title: '',
      phone: '',
    },
    validateOnBlur: false,
    validationSchema: deliveryOrderFormDataValidation,
    onSubmit: (values) => {
      startTransition(async () => {
        // const id_number = await getIdentifyNumber();
        // if (!id_number) {
        //   setOpen(true);
        //   return;
        // }
        const formData = {
          ...values,
          price: Number(values.price),
          weight: Number(values.weight),
          start_date: dayjs(values.start_date).format('YYYY-MM-DD'),
          end_date: dayjs(values.end_date).format('YYYY-MM-DD'),
        };
        const res = await createNewOrder(formData);
        if (res.status === 401) {
          toast.error('You need to login to share your journey');

          return;
        }
        if (!res.success) {
          toast.error(res.message);
          return;
        }
        toast.success('Your order created successfully');
        router.push(APP_ROUTER.DELIVERY_ORDERS);
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
            error={Boolean(errors.start_date)}
            message={errors.start_date}
            selected={values.start_date}
            handleSelect={(date) => setFieldValue('start_date', date)}
          />
        </div>
        <div className='new-order__form__boxes'>
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
        <div className='new-order__form__boxes'>
          <TextField
            required
            label='Weight (kg)'
            type='text'
            id='weight'
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.weight}
            error={Boolean(errors.weight && touched.weight)}
            message={touched.weight && errors.weight}
            name='weight'
            placeholder='Please enter the number of weight'
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
            placeholder='Please enter the size'
          />
          <span>SEK</span>
        </div>

        <div className='new-order__form__boxes select-box'>
          <Select
            required
            label='Select type of commodity'
            options={typeOfCommodityOptions}
            value={values.type_of_commodity}
            onSelect={(name, value) => setFieldValue(name, value)}
            name='type_of_commodity'
          />
        </div>
        {values.type_of_commodity === TypeOfCommodityEnum.PACKAGE ? (
          <div className='new-order__form__boxes '>
            <TextField
              required
              label='Size (length x width x height) in cm'
              type='tel'
              id='size'
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.size}
              error={Boolean(errors.size && touched.size)}
              message={touched.size && errors.size}
              name='size'
              placeholder='Please enter the size'
            />
          </div>
        ) : null}
        <div className='new-order__form__boxes price-box'>
          <TextField
            required
            label='Phone'
            type='tel'
            id='phone'
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.phone}
            error={Boolean(errors.phone && touched.phone)}
            message={touched.phone && errors.phone}
            name='phone'
            placeholder='Please enter the size'
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
            Create Order{' '}
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
