import Image from 'next/image';
import React from 'react';
import {
  GreenCarpoolingIcon,
  WaitingShippingIcon,
} from '../../../../lib/config/svg';

type Props = {};

export default function Statistical({}: Props) {
  return (
    <article className='statistical'>
      <div className='statistical__container'>
        <aside className='cards'>
          <GreenCarpoolingIcon />
          <p className='cards__total'>1.000 companions</p>
        </aside>
        <aside className='cards'>
          <WaitingShippingIcon />
          <p className='cards__total'>20.000 orders</p>
        </aside>
      </div>
    </article>
  );
}
