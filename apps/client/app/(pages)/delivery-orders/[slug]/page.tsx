import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import './OrderDetails.scss';
import {
  getAllDeliveryOrder,
  getOneDeliveryOrderBySlug,
  takeOrder,
} from '../../../actions/deliveryOrderApi';
import { DeliveryOrderDocument } from '@repo/shared';
import { Suspense } from 'react';
import LoadingSpinner from '../../../components/UI/Loading';
import Details from '../../../components/shared/RideInfo/Details';
type Props = {
  params: { slug: string };
};

export default async function OrderDetailsPage({ params: { slug } }: Props) {
  const res = await getOneDeliveryOrderBySlug(slug);
  if (res.status === 404 || !res.data?._id) {
    notFound();
  }

  const handleBecomeCompanion = async (ride_id: string, ride_slug: string) => {
    'use server';
    return await takeOrder(ride_id, ride_slug);
  };
  return (
    <div className="delivery-order__details">
      {res.data && res.data._id && (
        <Suspense fallback={<LoadingSpinner />}>
          <Details<DeliveryOrderDocument>
            ride={res.data}
            handleBecomeCompanion={handleBecomeCompanion}
          />
        </Suspense>
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
