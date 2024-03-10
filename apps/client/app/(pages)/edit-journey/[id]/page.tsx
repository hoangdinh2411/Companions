import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getOneJourneyById } from '../../../actions/journeyApi';
import LoadingSpinner from '../../../components/UI/Loading';
const Form = dynamic(
  () => import('../../../components/shared/Forms/journey/JourneyForm'),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  }
);
type Props = {
  params: { id: string };
};

export default async function EditJourneyPage({ params: { id } }: Props) {
  const res = await getOneJourneyById(id);
  if (res.status === 404 || !res.data?._id) {
    notFound();
  }

  return <Form journey={res.data} heading='Edit journey' />;
}

export async function generateMetadata(
  { params: { id } }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  if (!id) notFound();
  const res = await getOneJourneyById(id);
  if (res.status === 404 || !res.data?._id) {
    notFound();
  }
  return {
    title: `Edit Journey: ${res.data?.title}`,
    description: `${res.data?.from} to ${res.data?.to} on ${res.data?.start_date} - ${res.data?.end_date} . Join us for a great journey!`,
  };
}
