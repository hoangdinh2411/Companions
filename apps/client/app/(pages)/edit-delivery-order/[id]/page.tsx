import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import LoadingSpinner from '../../../components/UI/Loading';
import { getOneDeliveryOrderById } from '../../../actions/deliveryOrderApi';
const DeliveryOrderForm = dynamic(
  () =>
    import('../../../components/shared/Forms/deliveryOrder/DeliverOrderForm'),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  }
);
type Props = {
  params: { id: string };
};

export default async function EditDeliveryOrderPage({ params: { id } }: Props) {
  const res = await getOneDeliveryOrderById(id);

  if (res.status === 404 || !res.data?._id) {
    notFound();
  }

  return <DeliveryOrderForm order={res.data} heading='Edit journey' />;
}

export async function generateMetadata({
  params: { id },
}: Props): Promise<Metadata> {
  if (!id) notFound();
  const res = await getOneDeliveryOrderById(id);
  if (res.status === 404 || !res.data?._id) {
    notFound();
  }
  return {
    title: `Edit order: ${res.data?.title}`,
    description: `${res.data?.from} to ${res.data?.to} on ${res.data?.start_date} - ${res.data?.end_date}. Together we can make it happen.`,
  };
}
