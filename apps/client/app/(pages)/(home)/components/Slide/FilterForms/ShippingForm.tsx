'use client';
import React, { startTransition, useState } from 'react';
import TextField from '../../../../../components/UI/TextField';
import './FilterForm.scss';
import DatePicker from '../../../../../components/UI/DatePicker/DatePicker';
import Button from '../../../../../components/UI/Button';
import Select from '../../../../../components/UI/Select';
import { typeOfCommodityOptions } from '../../../../../lib/config/variables';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import APP_ROUTER from '../../../../../lib/config/router';
import { useRouter } from 'next/navigation';

export default function ShippingForm() {
  const router = useRouter();
  const [start_date, setstart_date] = useState<Date | undefined>(new Date());
  const [type_of_commodity, settype_of_commodity] = useState<string>('');
  const fromRef = React.useRef<HTMLInputElement>(null);
  const toRef = React.useRef<HTMLInputElement>(null);
  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      if (!fromRef.current || fromRef.current.value === '') {
        toast.error('Please enter a valid "FROM" location');
        return;
      }
      if (!toRef.current || toRef.current.value === '') {
        toast.error('Please enter a valid "TO" location');
        return;
      }
      if (!start_date) {
        toast.error('Please enter a valid date');
        return;
      }
      if (!start_date) {
        toast.error('Please enter a valid date');
        return;
      }
      if (!type_of_commodity) {
        toast.error('Please select a type of commodity');
        return;
      }
      const params = new URLSearchParams();
      params.append('from', fromRef.current.value);
      params.append('to', toRef.current.value);
      params.append('start_date', dayjs(start_date).format('YYYY-MM-DD'));
      router.push(`${APP_ROUTER.DELIVERY_ORDERS}?${params.toString()}`);
    });
  };
  return (
    <form
      autoComplete='off'
      method='POST'
      className='filter-form filter-form--shipping'
      onSubmit={handleFilter}
    >
      <TextField placeholder='From...' className='boxes' ref={fromRef} />
      <TextField placeholder='To...' className='boxes' ref={toRef} />
      <DatePicker
        className='boxes'
        selected={start_date}
        handleSelect={(date) => setstart_date(date)}
      />
      <Select
        options={typeOfCommodityOptions}
        value={type_of_commodity}
        onSelect={(_, value) => {
          settype_of_commodity(value);
        }}
      />
      <div className='button-container'>
        <Button type='submit'>Search</Button>
      </div>
    </form>
  );
}
