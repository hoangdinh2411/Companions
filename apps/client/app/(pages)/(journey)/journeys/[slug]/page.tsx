import { Metadata, ResolvingMetadata } from 'next';
import { getOneJourneyBySlug } from '../../../../actions/journeyApi';
import { notFound } from 'next/navigation';

import './JourneyDetails.scss';
import Details from './components/Details';
import Creator from './components/Creator';
type Props = {
  params: { slug: string };
};

export default async function JourneyDetailsPage({ params: { slug } }: Props) {
  const res = await getOneJourneyBySlug(slug);

  if (!res.success || (res.data && !res.data.hasOwnProperty('_id'))) {
    notFound();
  }
  return (
    <div className='journey-details'>
      {res.data && res.data.hasOwnProperty('_id') && (
        <div className='journey-details__container'>
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
  const res = await getOneJourneyBySlug(slug);
  if (!res.success || (res.data && !res.data.hasOwnProperty('_id'))) {
    notFound();
  }
  return {
    title: `Journey: ${res.data?.title}`,
    description: `${res.data?.from} to ${res.data?.to} on ${res.data?.startDate} - ${res.data?.endDate} - ${res.data?.message || 'Join us for a great journey!'}`,
  };
}
