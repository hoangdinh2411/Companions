'use client';
import React, { useState } from 'react';
import 'react-day-picker/dist/style.css';
import './DatePicker.scss';
import dayjs from 'dayjs';
import { DayPicker } from 'react-day-picker';
import TextField from '../TextField';

type Props = {
  selected: Date | undefined;
  handleSelect: (date: Date | undefined) => void;
  className?: string;
  label?: string;
  id?: string;
  error?: boolean;
  message?: any;
  name?: string;
  required?: boolean;
};

export default function DatePicker({
  selected = new Date(),
  handleSelect,
  className = '',
  label,
  id,
  error,
  message = '',
  required,
}: Props) {
  const [showDatePicket, setShowDatePicker] = useState<boolean>(false);

  const onSelect = (date: Date | undefined) => {
    handleSelect(date);
    setShowDatePicker(false);
  };

  const footer = (
    <p className="date-picker__footer" onClick={() => handleSelect(new Date())}>
      Today
    </p>
  );

  return (
    <div className={`date-picker ${className}`}>
      <TextField
        required={required}
        label={label}
        id={id}
        type="button"
        error={error}
        message={message}
        value={selected ? dayjs(selected).format('dddd YYYY/MM/DD') : ''}
        placeholder="Departure time..."
        onMouseDown={() => setShowDatePicker(!showDatePicket)}
      />
      {showDatePicket && (
        <DayPicker
          mode="single"
          selected={selected}
          onSelect={onSelect}
          footer={footer}
        />
      )}
    </div>
  );
}
