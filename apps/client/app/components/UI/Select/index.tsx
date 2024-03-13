'use client';
import './Select.scss';
import { ArrowDownIcon, ArrowUpIcon, ErrorIcon } from '../../../lib/config/svg';
type Option = {
  _id?: string | number;
  value: string | number;
  label: string | number;
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
  required?: boolean;
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
    required = false,
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

  const selectedValue =
    value !== '' ? options.find((item) => item.value === value) : null;

  return (
    <fieldset className={selectClassName} style={style}>
      {label && (
        <label htmlFor={id} className='textfield__label'>
          <p>
            {required && '*'}
            {label}:
          </p>
        </label>
      )}
      <label className={`dropdown `} htmlFor='dropdown'>
        <input type='checkbox' id='dropdown' />
        <div id='dropdown-btn'>
          {value === '' ? 'Select' : selectedValue?.label}
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
                key={item._id}
                onClick={() => {
                  handleClick(item.value);
                }}
              >
                {item.label}
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

export default Select;
