import { JourneyDocument } from '@repo/shared';
import React from 'react';
import APP_ROUTER from '../../../../../lib/config/router';
import Link from 'next/link';
import { WaitingShippingIcon } from '../../../../../lib/config/svg';

type Props = {
  order: JourneyDocument;
};

export default function OrderCard({ order }: Props) {
  return (
    <article className='orders__cards' title={order.time}>
      <Link
        href={`${APP_ROUTER.DELIVERY_ORDERS}/${order.slug}`}
        className='card'
      >
        <div className='card__icon'>
          <WaitingShippingIcon />
        </div>
        <div className='card__content'>
          <p className='title'>{order.title}</p>
          <p className='route'>
            {order.from} - {order.to}
          </p>
          <span className='date'>Date: {order.startDate}</span>
        </div>
      </Link>
    </article>
  );
}
