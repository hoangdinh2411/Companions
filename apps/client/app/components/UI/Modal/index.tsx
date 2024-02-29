'use client';
import { HTMLAttributes } from 'react';
import './Modal.scss';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
}

export default function Modal(props: ModalProps) {
  const { children, open = false, onClose, className } = props;

  let modalClasses = 'modal';
  if (open) {
    modalClasses += ' open';
  }

  if (className) {
    modalClasses += ` ${className}`;
  }
  return (
    <div className={modalClasses}>
      <div className='modal__overlay' onClick={onClose}></div>
      <div className='modal__content'>
        <span
          className='modal__close-icon'
          title='Close modal'
          onClick={onClose}
        >
          X
        </span>
        {children}
      </div>
    </div>
  );
}
