import { DeliverOrderDocument } from '@repo/shared';
import React from 'react';

type Props = {
  order: DeliverOrderDocument;
};

export default function Creator({ order }: Props) {
  return (
    <section className='creator cards'>
      {order?.be_in_touch ? (
        <p className='creator__be-in-touch'>
          The driver will to be in touch with you. So please be sure to check
          your contact details.
        </p>
      ) : (
        <>
          <article className='creator__phone'>
            Name: <span>{order?.created_by?.full_name}</span>
          </article>
          <article className='creator__email'>
            Email: <span>{order?.created_by?.email}</span>
          </article>
          <article className='creator__phone'>
            Phone: <span>{order?.created_by?.phone}</span>
          </article>
        </>
      )}
    </section>
  );
}
