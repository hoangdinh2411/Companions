import { Metadata } from 'next';
import './Orders.scss';
import SearchBar from './components/SearchBar';
import OrderList from './components/OrderList';
import { Suspense } from 'react';
import LoadingSpinner from '../../../components/UI/Loading';
import { generateSearchParams } from '../../../lib/utils/generateSearchParams';
import {
  filterDeliveryOrder,
  getAllDeliveryOrder,
  searchDeliveryOrder,
} from '../../../actions/deliveryOrderApi';

export default async function DeliveryOrdersPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  let params = '';
  let res;
  const { from, to, start_date, search_text, type_of_commodity } = searchParams;
  if (from && to && start_date) {
    params = generateSearchParams(
      ['from', 'to', 'start_date', 'type_of_commodity'],
      searchParams
    );
    res = await filterDeliveryOrder(params.toString());
  } else if (search_text) {
    params = generateSearchParams(['search_text'], searchParams);
    res = await searchDeliveryOrder(params.toString());
  } else {
    params = generateSearchParams(['page', 'limit'], searchParams);
    res = await getAllDeliveryOrder(params.toString());
  }

  return (
    <div className='orders'>
      <div className='orders__container'>
        {search_text || from || to || start_date || type_of_commodity ? (
          <strong>
            Empty search field for fetching newest delivery orders
          </strong>
        ) : null}
        <SearchBar />
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
