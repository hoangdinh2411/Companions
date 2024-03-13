import React, { InputHTMLAttributes } from 'react';
import './TextField.scss';
import { ErrorIcon } from '../../../lib/config/svg';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  message?: any;
  variant?: 'outlined' | 'contained';
  required?: boolean;
}
const TextField = React.forwardRef(
  (props: TextFieldProps, ref: React.Ref<HTMLInputElement>) => {
    const {
      className,
      label,
      id,
      error,
      message = '',
      variant = 'contained',
      required = false,
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
        {label && (
          <label htmlFor={id} className='textfield__label'>
            <p>
              {required && '*'}
              {label}:
            </p>
          </label>
        )}
        <input id={id} type='text' ref={ref} {...rest} />
        {error && (
          <small className='textfield__error'>
            <ErrorIcon />
            {message}
          </small>
        )}
      </fieldset>
    );
  }
);

export default TextField;
