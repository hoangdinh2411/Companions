'use client';
import React, { useState } from 'react';
import TextField from '../../../../../components/UI/TextField';
import './SearchForm.scss';
import DatePicker from '../../../../../components/UI/DatePicker/DatePicker';
import Button from '../../../../../components/UI/Button';
import Select from '../../../../../components/UI/Select';

const data = [
  {
    _id: 'all',
    key: 'all',
    value: 'All',
  },
  {
    _id: 'Receiver',
    key: 'Receiver',
    value: 'Receiver',
  },
  {
    _id: 'Giver',
    key: 'Giver',
    value: 'Giver',
  },
];
export default function ShippingForm() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedOption, setSelectedOption] = useState('all');
  return (
    <form autoComplete='off' method='POST' className='shipping-form'>
      <TextField placeholder='From...' className='boxes' />
      <TextField placeholder='To...' className='boxes' />
      <DatePicker
        className='boxes'
        selected={selectedDate}
        handleSelect={(date) => setSelectedDate(date)}
      />
      <Select
        className='boxes'
        options={data}
        value={selectedOption}
        onSelect={(name, value) => setSelectedOption(value)}
      />

      <div className='button-container'>
        <Button type='submit'>Search</Button>
      </div>
    </form>
  );
}
