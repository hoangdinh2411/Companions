import Image from 'next/image';
import React from 'react';

type Props = {};

export default function Statistical({}: Props) {
  return (
    <article className='statistical'>
      <div className='statistical__container'>
        <aside className='cards'>
          <figure className='cards__image'>
            <Image
              src='/icons/green-carpooling.svg'
              alt='Car pooling'
              width={64}
              height={64}
            />
          </figure>
          <p className='cards__total'>1.000 companions</p>
        </aside>
        <aside className='cards'>
          <figure className='cards__image'>
            <Image
              src='/icons/waiting-shipping.svg'
              alt='Shipping'
              width={64}
              height={64}
            />
          </figure>
          <p className='cards__total'>20.000 orders</p>
        </aside>
      </div>
    </article>
  );
}
