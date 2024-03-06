'use client';
import { JourneyDocument } from '@repo/shared';
import Action from './Action';

type Props = {
  journey: JourneyDocument;
};
export default function Details({ journey }: Props) {
  return (
    <>
      <section className='details cards'>
        <h4 className='details__title'>
          {' '}
          {journey?.title}
          <Action journey={journey} />
        </h4>
        <article className='details__boxes'>
          From: <span>{journey?.from}</span>
        </article>
        <article className='details__boxes'>
          To: <span>{journey?.to}</span>
        </article>
        <article className='details__boxes'>
          Start: <span>{journey?.start_date}</span>
        </article>
        <article className='details__boxes'>
          End: <span>{journey?.end_date}</span>
        </article>
        <article className='details__boxes'>
          Time: <span>{journey?.time}</span>
        </article>
        <article className='details__boxes'>
          Seats: <span>{journey?.seats}</span>
        </article>
        <article className='details__boxes'>
          Price:{' '}
          <span>
            {journey?.price === 0 ? 'Free' : journey?.price + ' SEK'}{' '}
          </span>
        </article>
        <article className='details__boxes'>
          Total Joiner:{' '}
          <span>
            {journey?.companions?.length > 0 ? journey?.companions?.length : 0}
          </span>
        </article>
        <article className='details__boxes details__boxes--message'>
          Message:{' '}
          <div>
            {!journey?.message ? (
              "(don't have any message for this journey yet!)"
            ) : (
              <blockquote>
                <p>{journey?.message} </p>
              </blockquote>
            )}
          </div>
        </article>
      </section>
    </>
  );
}
