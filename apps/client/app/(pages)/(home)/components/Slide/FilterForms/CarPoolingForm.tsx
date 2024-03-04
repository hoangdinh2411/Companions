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

export default function CarpoolingForm() {
  const [isPending, startTransition] = useTransition();
  const [start_date, setstart_date] = useState<Date | undefined>(new Date());
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
      if (!start_date) {
        toast.error('Please enter a valid date');
        return;
      }
      const params = new URLSearchParams();
      params.append('from', fromRef.current.value);
      params.append('to', toRef.current.value);
      params.append('start_date', dayjs(start_date).format('YYYY-MM-DD'));
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
        selected={start_date}
        handleSelect={(date) => setstart_date(date)}
      />

      <div className='button-container'>
        <Button type='submit' loading={isPending}>
          Search
        </Button>
      </div>
    </form>
  );
}