'use client';
import { memo } from 'react';
import './Select.scss';
import { ArrowDownIcon, ArrowUpIcon, ErrorIcon } from '../../../lib/config/svg';
// const data = [
//   {
//     _id: 123,
//     key: 'one',
//     value: 'One',
//   },
//   {
//     _id: 124,
//     key: 'two',
//     value: 'Two',
//   },
//   {
//     _id: 125,
//     key: 'three',
//     value: 'Three',
//   },
// ];
type Option = {
  _id: string | number;
  key: string | number;
  value: string | number;
};

interface SelectProps {
  className?: string;
  id?: string;
  value: string;
  label?: string;
  error?: boolean;
  message?: string;
  options: Option[];
  name?: string;
  onSelect: (name: string, value: any) => void;
  style?: React.CSSProperties;
}

function Select(props: SelectProps) {
  const {
    className,
    label,
    id,
    error,
    message,
    value,
    options = [],
    onSelect,
    style,
    name = '',
  } = props;

  let selectClassName = 'select-wrapper';
  if (error) {
    selectClassName += ` error`;
  }
  if (className) {
    selectClassName += ` ${className}`;
  }

  const handleClick = (value: any) => {
    onSelect(name, value);
  };

  return (
    <fieldset className={selectClassName} style={style}>
      {label && <label htmlFor={id}>{label}</label>}
      <label className={`dropdown `} htmlFor='dropdown'>
        <input type='checkbox' id='dropdown' />
        <span id='overlay'></span>

        <div id='dropdown-btn'>
          {value === '' ? 'Select' : value}
          <span className=' arrow-up dropdown-icons'>
            <ArrowUpIcon />
          </span>
          <span className=' arrow-down dropdown-icons'>
            <ArrowDownIcon />
          </span>
        </div>
        <div id='dropdown-content'>
          <ul>
            {options.map((item) => (
              <li
                className={`item ${value === item.value ? 'selected' : ''}`}
                key={item._id || item.key}
                onClick={() => {
                  handleClick(item.value);
                }}
              >
                {item.value}
              </li>
            ))}
          </ul>
        </div>
      </label>

      {error && (
        <small className='dropdown-error'>
          <ErrorIcon />
          {message}
        </small>
      )}
    </fieldset>
  );
}

export default memo(Select);
