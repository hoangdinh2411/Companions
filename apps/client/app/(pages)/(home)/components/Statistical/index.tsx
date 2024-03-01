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
          <p className='cards__total'>
            1.000
            <span className='cards__total--sub'>Shared journeys</span>
          </p>
        </aside>
        <aside className='cards'>
          <WaitingShippingIcon />
          <p className='cards__total'>
            20.000
            <span className='cards__total--sub'>Waiting orders</span>
          </p>
        </aside>
      </div>
    </article>
  );
}
