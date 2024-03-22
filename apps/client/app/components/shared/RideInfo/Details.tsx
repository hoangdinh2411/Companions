'use client';
import { DeliveryOrderDocument, JourneyDocument } from '@repo/shared';
import Action from './Action';
import {
  formatToSwedenCurrency,
  formatWeight,
} from '../../../lib/utils/format';
import Creator from './Creator';
import './RideInfo.scss';

const RIDE_DETAILS = {
  from: 'from:',
  to: 'to:',
  start_date: 'start:',
  end_date: 'end:',
  price: 'price:',
  weight: 'weight:',
  size: 'size:',
  type_of_commodity: 'type of commodity:',
};

const rideDetailFields: (keyof DeliveryOrderDocument | JourneyDocument)[] = [
  'from',
  'to',
  'start_date',
  'end_date',
  'price',
  'weight',
  'size',
  'type_of_commodity',
];

// using the generic type T for this component
interface Props<T> {
  ride: T;
  handleBecomeCompanion: (ride_id: string, ride_slug: string) => Promise<any>;
}

export default function Details<
  T extends DeliveryOrderDocument | JourneyDocument,
>({ ride, handleBecomeCompanion }: Props<T>) {
  return (
    <div className="ride">
      <section className="ride__details cards">
        <article className="ride__details__title">
          {ride?.title}
          <Action ride={ride} handleBecomeCompanion={handleBecomeCompanion} />
        </article>
        {rideDetailFields.map((field, index) => {
          if (ride[field as keyof typeof ride]) {
            let value = ride[field as keyof typeof ride]?.toString();
            if (field === 'price' && value) {
              value = formatToSwedenCurrency(Number(value));
            }
            if (field === 'weight' && value) {
              value = formatWeight(Number(value));
            }
            if (field === 'size' && value) {
              value = `${value} (length - width - height)`;
            }

            if (field === 'type_of_commodity' && value) {
              value = value.toUpperCase();
            }

            return (
              <article className="ride__details__boxes" key={index}>
                {RIDE_DETAILS[field as keyof typeof RIDE_DETAILS]}
                <span>{value}</span>
              </article>
            );
          }
          return null;
        })}
        <article className="ride__details__boxes ride__details__boxes--message">
          Message:{' '}
          <div>
            {!ride?.message ? (
              "(don't have any message for this journey yet!)"
            ) : (
              <blockquote>
                <p>{ride?.message} </p>
              </blockquote>
            )}
          </div>
        </article>
      </section>
      <Creator<T> ride={ride} />
    </div>
  );
}
