import { DeliveryOrderDocument } from '@repo/shared';
import Action from './Action';
import {
  formatToSwedenCurrency,
  formatWeight,
} from '../../../../lib/utils/format';

type Props = {
  order: DeliveryOrderDocument;
};

export default function Details({ order }: Props) {
  return (
    <>
      <section className='details cards'>
        <h4 className='details__title'>
          {' '}
          {order?.title}
          <Action order={order} />
        </h4>
        <article className='details__boxes'>
          From: <span>{order?.from}</span>
        </article>
        <article className='details__boxes'>
          To: <span>{order?.to}</span>
        </article>
        <article className='details__boxes'>
          Start: <span>{order?.start_date}</span>
        </article>
        <article className='details__boxes'>
          End: <span>{order?.end_date}</span>
        </article>
        <article className='details__boxes'>
          Weight: <span>{formatWeight(order.weight)}</span>
        </article>
        <article className='details__boxes'>
          Type Of Commodity:{' '}
          <span>{order?.type_of_commodity.toUpperCase()} </span>
        </article>
        {order?.size ? (
          <article className='details__boxes'>
            Size: <span>{order?.size ?? ''} (length - width - height) </span>
          </article>
        ) : null}
        <article className='details__boxes'>
          Price: <span>{formatToSwedenCurrency(order.price)} </span>
        </article>
        <article className='details__boxes details__boxes--message'>
          Message:{' '}
          <div>
            {!order?.message ? (
              "(don't have any message for this journey yet!)"
            ) : (
              <blockquote>
                <p>{order?.message} </p>
              </blockquote>
            )}
          </div>
        </article>
      </section>
    </>
  );
}
