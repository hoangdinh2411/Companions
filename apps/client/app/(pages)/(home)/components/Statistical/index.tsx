import React, { use } from 'react';
import {
  GreenCarpoolingIcon,
  WaitingShippingIcon,
} from '../../../../lib/config/svg';
import { StatisticResponse } from '@repo/shared';
import { IResponse } from '../../../../actions/customFetch';

type Props = {
  getStatisticPromise: Promise<IResponse<StatisticResponse>>;
};

export default function Statistical({ getStatisticPromise }: Props) {
  const res = use(getStatisticPromise);
  return (
    <article className='statistical'>
      <div className='statistical__container'>
        <aside className='cards'>
          <GreenCarpoolingIcon />
          <p className='cards__total'>
            {res?.data?.journeys.toLocaleString() || 0}
            <span className='cards__total--sub'>Shared journeys</span>
          </p>
        </aside>
        <aside className='cards'>
          <WaitingShippingIcon />
          <p className='cards__total'>
            {res?.data?.orders.toLocaleString() || 0}
            <span className='cards__total--sub'>Waiting orders</span>
          </p>
        </aside>
      </div>
    </article>
  );
}
