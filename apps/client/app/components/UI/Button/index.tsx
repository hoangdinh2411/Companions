'use client';
import React, { ButtonHTMLAttributes } from 'react';
import './Button.scss';
import { useFormStatus } from 'react-dom';
import LoadingSpinner from '../Loading';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'green' | 'white';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
}

export default function Button(props: ButtonProps) {
  const {
    children,
    variant = 'default',
    size = 'medium',
    className = '',
    fullWidth = false,
    loading = false,
    ...rest
  } = props;

  const { pending } = useFormStatus();

  let buttonClassNames = `btn`;
  if (variant !== 'default') {
    buttonClassNames += ' btn--' + variant;
  }
  if (size !== 'medium') {
    buttonClassNames += ' btn--' + size;
  }

  if (className) {
    buttonClassNames += ' ' + className;
  }

  if (pending || loading) {
    buttonClassNames += ' btn--pending';
  }

  if (fullWidth) {
    buttonClassNames += ' btn--fullWidth';
  }
  return (
    <button className={buttonClassNames} {...rest}>
      {pending || loading ? <LoadingSpinner /> : children}
    </button>
  );
}
