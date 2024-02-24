import React, { ButtonHTMLAttributes } from 'react';
import './Button.scss';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'green' | 'white';
  size?: 'small' | 'medium' | 'large';
}

export default function Button(props: ButtonProps) {
  const {
    children,
    variant = 'default',
    size = 'medium',
    className = '',
    ...rest
  } = props;

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
  return (
    <button className={buttonClassNames} {...rest}>
      {children}
    </button>
  );
}
