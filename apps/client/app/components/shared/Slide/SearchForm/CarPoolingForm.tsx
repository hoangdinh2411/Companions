'use client';
import React, { useState } from 'react';
import TextField from '../../../UI/TextField';
import './SearchForm.scss';
import DatePicker from '../../../UI/DatePicker/DatePicker';
import Button from '../../../UI/Button';

export default function CarpoolingForm() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  return (
    <form autoComplete='off' method='POST'>
      <TextField placeholder='From...' className='boxes' />
      <TextField placeholder='To...' className='boxes' />
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
