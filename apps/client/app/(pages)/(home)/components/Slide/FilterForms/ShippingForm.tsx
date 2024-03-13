'use client';
import React, { startTransition, useState } from 'react';
import TextField from '../../../../../components/UI/TextField';
import './FilterForm.scss';
import DatePicker from '../../../../../components/UI/DatePicker/DatePicker';
import Button from '../../../../../components/UI/Button';
import Select from '../../../../../components/UI/Select';
import { typeOfCommodityOptionsForFilter } from '../../../../../lib/config/variables';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import APP_ROUTER from '../../../../../lib/config/router';
import { useRouter } from 'next/navigation';
import { generateSearchParams } from '../../../../../lib/utils/generateSearchParams';

export default function ShippingForm() {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [typeOfCommodity, setTypeOFCommodity] = useState<string>('');
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
      if (!startDate) {
        toast.error('Please enter a valid date');
        return;
      }
      if (!typeOfCommodity) {
        toast.error('Please select a type of commodity');
        return;
      }
      const params = generateSearchParams(
        ['from', 'to', 'start_date', 'type_of_commodity'],
        {
          from: fromRef.current.value,
          to: toRef.current.value,
          start_date: dayjs(startDate).format('YYYY-MM-DD'),
          type_of_commodity: typeOfCommodity,
        }
      );

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
        selected={startDate}
        handleSelect={(date) => setStartDate(date)}
      />
      <Select
        options={typeOfCommodityOptionsForFilter}
        value={typeOfCommodity}
        onSelect={(_, value) => {
          setTypeOFCommodity(value);
        }}
      />
      <div className='button-container'>
        <Button type='submit'>Search</Button>
      </div>
    </form>
  );
}
