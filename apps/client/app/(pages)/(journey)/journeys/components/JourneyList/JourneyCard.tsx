import { JourneyDocument } from '@repo/shared';
import React from 'react';
import APP_ROUTER from '../../../../../lib/config/router';
import Link from 'next/link';
import { GreenCarpoolingIcon } from '../../../../../lib/config/svg';

type Props = {
  journey: JourneyDocument;
};

export default function JourneyCard({ journey }: Props) {
  return (
    <article className='journeys__cards' title={journey.time}>
      <Link href={`${APP_ROUTER.JOURNEYS}/${journey.slug}`} className='card'>
        <div className='card__icon'>
          <GreenCarpoolingIcon />
        </div>
        <div className='card__content'>
          <p className='title'>{journey.title}</p>
          <p className='route'>
            {journey.from} - {journey.to}
          </p>
          <span className='date'>Date: {journey.startDate}</span>
        </div>
      </Link>
    </article>
  );
}
