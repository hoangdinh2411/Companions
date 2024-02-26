'use client';
import React, { useState } from 'react';
import 'react-day-picker/dist/style.css';
import './DatePicker.scss';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import TextField from '../TextField';
type Props = {
  selected: Date | undefined;
  handleSelect: (date: Date | undefined) => void;
  className?: string;
};

export default function DatePicker({
  selected = new Date(),
  handleSelect,
  className = '',
}: Props) {
  const [showDatePicket, setShowDatePicker] = useState<boolean>(false);

  const onSelect = (date: Date | undefined) => {
    handleSelect(date);
    setShowDatePicker(false);
  };

  const footer = (
    <p className='date-picker__footer' onClick={() => handleSelect(new Date())}>
      Today
    </p>
  );

  return (
    <div className={`date-picker ${className}`}>
      <TextField
        type='button'
        value={selected ? format(selected, 'PPP') : ''}
        placeholder='Departure time...'
        onMouseDown={() => setShowDatePicker(!showDatePicket)}
      />
      {showDatePicket && (
        <DayPicker
          mode='single'
          selected={selected}
          onSelect={onSelect}
          footer={footer}
        />
      )}
    </div>
  );
}
