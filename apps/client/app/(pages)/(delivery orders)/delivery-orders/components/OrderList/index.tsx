import { DeliveryOrderResponse } from '@repo/shared';
import React from 'react';
import OrderCard from './OrderCard';
import Pagination from '../../../../../components/UI/Pagination.tsx';
type Props = {
  data: DeliveryOrderResponse | undefined;
};

export default function OrderList({ data }: Props) {
  if (data && data.items.length === 0) {
    return <h4>Order not found</h4>;
  }
  return (
    <>
      <section className='orders__list'>
        {data &&
          data.items?.map((item, index) => (
            <OrderCard order={item} key={index} />
          ))}
      </section>
      {data && data.pagination && (
        <Pagination total={data ? data.pagination.pages : 1} />
      )}
    </>
  );
}
