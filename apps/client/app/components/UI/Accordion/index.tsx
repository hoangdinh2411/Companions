import React, { HTMLAttributes } from 'react';
import './Accordion.scss';
import { ArrowDownIcon, ArrowUpIcon } from '../../../lib/config/svg';

interface IAccordionProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  heading: string;
  id: string;
}
const Accordion = ({
  children,
  heading,
  className = '',
  id,
  ...rest
}: IAccordionProps) => {
  return (
    <div className={`accordion  ${className}`} {...rest}>
      <input type='checkbox' id={id} />
      <label className='accordion__label' htmlFor={id}>
        {heading}
        <span className='accordion-icons arrow-up '>
          <ArrowUpIcon />
        </span>
        <span className=' accordion-icons arrow-down'>
          <ArrowDownIcon />
        </span>
      </label>
      <div className='accordion__panel'>{children}</div>
    </div>
  );
};

export default React.memo(Accordion);
