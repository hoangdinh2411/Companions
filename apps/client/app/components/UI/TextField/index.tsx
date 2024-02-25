import { InputHTMLAttributes } from 'react';
import './TextField.scss';
import { ErrorIcon } from '../../../lib/config/svg';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  message?: string;
  variant?: 'outlined' | 'contained';
}
export default function TextField(props: TextFieldProps) {
  const {
    className,
    label,
    id,
    error,
    message,
    variant = 'contained',
    ...rest
  } = props;

  let textfieldClassName = 'textfield';
  if (error) {
    textfieldClassName += ` error`;
  }
  if (className) {
    textfieldClassName += ` ${className}`;
  }

  if (variant === 'outlined') {
    textfieldClassName += ` textfield--outlined`;
  }

  return (
    <fieldset className={textfieldClassName}>
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} type='text' {...rest} />
      {error && (
        <small className='textfield__error'>
          <ErrorIcon />
          {message}
        </small>
      )}
    </fieldset>
  );
}
