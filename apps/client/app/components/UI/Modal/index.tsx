'use client';
import { HTMLAttributes } from 'react';
import './Modal.scss';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  open?: boolean;
  disableClose?: boolean;
}

export default function Modal(props: ModalProps) {
  const router = useRouter();
  const { children, open = true, className, disableClose = false } = props;

  let modalClasses = 'modal';
  if (open) {
    modalClasses += ' open';
  }

  if (className) {
    modalClasses += ` ${className}`;
  }

  const handleClose = () => {
    if (disableClose) return;
    router.back();
  };
  return createPortal(
    <div className={modalClasses}>
      {!disableClose && (
        <span
          className='modal__close-icon'
          title='Close modal'
          onClick={handleClose}
        >
          X
        </span>
      )}
      <div className='modal__overlay' onClick={handleClose}></div>
      <div className='modal__content'>{children}</div>
    </div>,
    document.getElementById('modal-root')!
  );
}
