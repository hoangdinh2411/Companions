import { Metadata } from 'next';
import './Orders.scss';
import SearchBar from './components/SearchBar';
import { generateSearchParams } from '../../lib/utils/generateSearchParams';
import {
  filterDeliveryOrder,
  getAllDeliveryOrder,
  searchDeliveryOrder,
} from '../../actions/deliveryOrderApi';
import LoadingSpinner from '../../components/UI/Loading';
import dynamic from 'next/dynamic';

const OrderList = dynamic(() => import('./components/OrderList'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
export default async function DeliveryOrdersPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  let params = '';
  let res;
  const { from, to, start_date, search_text, type_of_commodity } = searchParams;
  if (from && to && start_date && type_of_commodity) {
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
    <div className="orders">
      <div className="orders__container">
        {search_text ? (
          <h6>
            Searching for "{search_text}" in delivery orders. Empty search field
            for fetching newest delivery orders
          </h6>
        ) : null}
        <SearchBar />
        <OrderList data={res.data} />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Delivery Orders Page',
  description: 'Delivery Orders Page',
};
