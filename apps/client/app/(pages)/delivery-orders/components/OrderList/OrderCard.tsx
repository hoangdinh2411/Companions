import { DeliveryOrderDocument, TypeOfCommodityEnum } from '@repo/shared';
import React from 'react';
import APP_ROUTER from '../../../../lib/config/router';
import Link from 'next/link';
import {
  DocumentIcon,
  FoodIcon,
  WaitingShippingIcon,
} from '../../../../lib/config/svg';

type Props = {
  order: DeliveryOrderDocument;
};

function getIconForTypeOfCommodity(type: TypeOfCommodityEnum) {
  switch (type) {
    case TypeOfCommodityEnum.FOOD:
      return <FoodIcon />;
    case TypeOfCommodityEnum.DOCUMENT:
      return <DocumentIcon />;

    default:
      return <WaitingShippingIcon />;
  }
}
export default function OrderCard({ order }: Props) {
  return (
    <article className='orders__cards'>
      <Link
        href={`${APP_ROUTER.DELIVERY_ORDERS}/${order.slug}`}
        className='card'
      >
        <div className='card__icon' title={order.type_of_commodity}>
          {getIconForTypeOfCommodity(order.type_of_commodity)}
        </div>
        <div className='card__content'>
          <p className='title' title={order.title}>
            {order.title}
          </p>
          <p className='route' title={order.from + ' to ' + order.to}>
            {order.from} - {order.to}
          </p>
          <span className='date'>Date: {order.start_date}</span>
        </div>
      </Link>
    </article>
  );
}
