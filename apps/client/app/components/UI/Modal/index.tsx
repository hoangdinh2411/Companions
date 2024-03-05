'use client';
import { HTMLAttributes } from 'react';
import './Modal.scss';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  disableClose?: boolean;
}

export default function Modal(props: ModalProps) {
  const {
    children,
    open = false,
    onClose,
    className,
    disableClose = false,
  } = props;

  let modalClasses = 'modal';
  if (open) {
    modalClasses += ' open';
  }

  if (className) {
    modalClasses += ` ${className}`;
  }

  const handleClose = () => {
    if (disableClose) return;
    onClose();
  };
  return (
    <div className={modalClasses}>
      <div className='modal__overlay' onClick={handleClose}></div>
      <div className='modal__content'>
        {!disableClose && (
          <span
            className='modal__close-icon'
            title='Close modal'
            onClick={handleClose}
          >
            X
          </span>
        )}
        {children}
      </div>
    </div>
  );
}
