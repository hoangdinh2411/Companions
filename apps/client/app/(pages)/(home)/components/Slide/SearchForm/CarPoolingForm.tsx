'use client';
import React, { useState } from 'react';
import TextField from '../../../../../components/UI/TextField';
import './SearchForm.scss';
import DatePicker from '../../../../../components/UI/DatePicker/DatePicker';
import Button from '../../../../../components/UI/Button';

export default function CarpoolingForm() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  return (
    <form autoComplete='off' method='POST' className='carpooling-form'>
      <TextField placeholder='From...' className='boxes' type='text' />
      <TextField placeholder='To...' className='boxes' type='text' />
      <DatePicker
        className='boxes'
        selected={selectedDate}
        handleSelect={(date) => setSelectedDate(date)}
      />

      <div className='button-container'>
        <Button type='submit'>Search</Button>
      </div>
    </form>
  );
}
