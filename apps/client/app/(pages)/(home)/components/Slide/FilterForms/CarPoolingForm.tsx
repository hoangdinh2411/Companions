'use client';
import React, { useState, useTransition } from 'react';
import TextField from '../../../../../components/UI/TextField';
import './FilterForm.scss';
import DatePicker from '../../../../../components/UI/DatePicker/DatePicker';
import Button from '../../../../../components/UI/Button';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import APP_ROUTER from '../../../../../lib/config/router';
import { generateSearchParams } from '../../../../../lib/utils/generateSearchParams';

export default function CarpoolingForm() {
  const [isPending, startTransition] = useTransition();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const fromRef = React.useRef<HTMLInputElement>(null);
  const toRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();
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
      const params = generateSearchParams(['from', 'to', 'start_date'], {
        from: fromRef.current.value,
        to: toRef.current.value,
        start_date: dayjs(startDate).format('YYYY-MM-DD'),
      });
      router.push(`${APP_ROUTER.JOURNEYS}?${params.toString()}`);
    });
  };
  return (
    <form autoComplete='off' onSubmit={handleFilter} className='filter-form'>
      <TextField
        ref={fromRef}
        placeholder='From...'
        className='boxes'
        type='text'
      />
      <TextField
        ref={toRef}
        placeholder='To...'
        className='boxes'
        type='text'
      />
      <DatePicker
        className='boxes'
        selected={startDate}
        handleSelect={(date) => setStartDate(date)}
      />

      <div className='button-container'>
        <Button type='submit' loading={isPending}>
          Search
        </Button>
      </div>
    </form>
  );
}
