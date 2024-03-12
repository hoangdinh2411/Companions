import React, { use } from 'react';
import {
  GreenCarpoolingIcon,
  WaitingShippingIcon,
} from '../../../../lib/config/svg';
import { fetchStatisticsAndUpdateStatusOldDocuments } from '../../../../actions/appApi';

export default async function Statistical() {
  const getStatisticPromise =
    await fetchStatisticsAndUpdateStatusOldDocuments();
  const data = getStatisticPromise.data;
  return (
    <article className='statistical'>
      <div className='statistical__container'>
        <aside className='cards'>
          <GreenCarpoolingIcon />
          <p className='cards__total'>
            {data?.journeys.toLocaleString() || 0}
            <span className='cards__total--sub'>Shared journeys</span>
          </p>
        </aside>
        <aside className='cards'>
          <WaitingShippingIcon />
          <p className='cards__total'>
            {data?.orders.toLocaleString() || 0}
            <span className='cards__total--sub'>Waiting orders</span>
          </p>
        </aside>
      </div>
    </article>
  );
}
