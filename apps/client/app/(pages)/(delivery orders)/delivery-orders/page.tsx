import { Metadata } from 'next';
import './Orders.scss';
import Filter from './components/Filter';
import OrderList from './components/OrderList';
import {
  filterJourneys,
  getAllJourneys,
  searchJourneys,
} from '../../../actions/journeyApi';
import { Suspense } from 'react';
import LoadingSpinner from '../../../components/UI/Loading';
import { generateSearchParams } from '../../../lib/utils/generateSearchParams';

export default async function DeliveryOrdersPage({
  searchParams,
}: {
  searchParams: {
    from: string;
    to: string;
    startDate: string;
    page: number;
    limit: number;
    searchText: string;
  };
}) {
  let params = '';
  let res;
  const { from, to, startDate, searchText, page, limit } = searchParams;
  if (from && to && startDate) {
    params = generateSearchParams(['from', 'to', 'startDate'], searchParams);
    res = await filterJourneys(params.toString());
  } else if (searchText) {
    params = generateSearchParams(['searchText'], searchParams);
    res = await searchJourneys(params.toString());
  } else {
    params = generateSearchParams(['page', 'limit'], searchParams);
    res = await getAllJourneys(params.toString());
  }

  return (
    <div className='orders'>
      <div className='orders__container'>
        <Filter />
        <Suspense fallback={<LoadingSpinner />}>
          <OrderList data={res.data} />
        </Suspense>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Delivery Orders Page',
  description: 'Delivery Orders Page',
};
