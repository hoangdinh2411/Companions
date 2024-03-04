import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

import './OrderDetails.scss';
import Details from './components/Details';
import Creator from './components/Creator';
import { getOneDeliveryOrBySlug } from '../../../../actions/deliveryOrderApi';
type Props = {
  params: { slug: string };
};

export default async function OrderDetailsPage({ params: { slug } }: Props) {
  const res = await getOneDeliveryOrBySlug(slug);

  if (!res.data || !res.data._id) {
    notFound();
  }
  return (
    <div className='delivery-order__details'>
      {res.data && res.data.hasOwnProperty('_id') && (
        <div className='delivery-order__details__container'>
          <Details data={res.data} />
          <Creator data={res.data} />
        </div>
      )}
    </div>
  );
}

export async function generateMetadata(
  { params: { slug } }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  if (!slug) notFound();
  const res = await getOneDeliveryOrBySlug(slug);
  if (!res.data || !res.data._id) {
    notFound();
  }
  return {
    title: `Order: ${res.data?.title}`,
    description: `${res.data?.from} to ${res.data?.to} on ${res.data?.start_date} - ${res.data?.end_date} . Join us for a great journey!`,
  };
}
