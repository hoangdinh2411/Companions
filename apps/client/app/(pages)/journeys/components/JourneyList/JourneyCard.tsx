import { JourneyDocument } from '@repo/shared';
import React from 'react';
import APP_ROUTER from '../../../../lib/config/router';
import Link from 'next/link';
import { GreenCarpoolingIcon } from '../../../../lib/config/svg';

type Props = {
  journey: JourneyDocument;
};

export default function JourneyCard({ journey }: Props) {
  return (
    <article className='journeys__cards'>
      <Link href={`${APP_ROUTER.JOURNEYS}/${journey.slug}`} className='card'>
        <div className='card__icon'>
          <GreenCarpoolingIcon />
        </div>
        <div className='card__content'>
          <p className='title' title={journey.title}>
            {journey.title}
          </p>
          <p className='route' title={journey.from + ' to ' + journey.to}>
            {journey.from} - {journey.to}
          </p>
          <span className='date'>Date: {journey.start_date}</span>
        </div>
      </Link>
    </article>
  );
}
