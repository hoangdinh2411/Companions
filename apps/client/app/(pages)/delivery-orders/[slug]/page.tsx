import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import './OrderDetails.scss';
import Details from './components/Details';
import Creator from './components/Creator';
import {
  getAllDeliveryOrder,
  getOneDeliveryOrderBySlug,
} from '../../../actions/deliveryOrderApi';
import { DeliveryOrderDocument } from '@repo/shared';
type Props = {
  params: { slug: string };
};

export default async function OrderDetailsPage({ params: { slug } }: Props) {
  const res = await getOneDeliveryOrderBySlug(slug);
  if (res.status === 404 || !res.data?._id) {
    notFound();
  }

  return (
    <div className="delivery-order__details">
      {res.data && res.data._id && (
        <div className="delivery-order__details__container">
          <Details order={res.data} />
          <Creator order={res.data} />
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({
  params: { slug },
}: Props): Promise<Metadata> {
  if (!slug) notFound();
  const res = await getOneDeliveryOrderBySlug(slug);
  if (res.status === 404 || !res.data?._id) {
    notFound();
  }
  return {
    title: `Order: ${res.data?.title}`,
    description: `${res.data?.from} to ${res.data?.to} on ${res.data?.start_date} - ${res.data?.end_date}`,
  };
}

export async function generateStaticParams() {
  const res = await getAllDeliveryOrder();

  if (res.status === 404 || !res.data) {
    return [];
  }

  return res.data.items.map((order: DeliveryOrderDocument) => {
    return {
      slug: order.slug,
    };
  });
}
