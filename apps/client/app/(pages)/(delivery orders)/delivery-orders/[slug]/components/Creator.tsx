import { DeliverOrderDocument } from '@repo/shared';
import React from 'react';

type Props = {
  data: DeliverOrderDocument;
};

export default function Creator({ data }: Props) {
  return (
    <section className='creator cards'>
      <h5 className='creator__header'>Created By</h5>
      <article className='creator__email'>
        Email: <span>{data?.created_by?.email}</span>
      </article>
      <article className='creator__phone'>
        Phone: <span>{data?.created_by?.phone}</span>
      </article>
    </section>
  );
}
