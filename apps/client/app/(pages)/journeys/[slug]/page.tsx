import { Metadata } from 'next';
import {
  getAllJourneys,
  getOneJourneyBySlug,
  joinJourney,
} from '../../../actions/journeyApi';
import { notFound } from 'next/navigation';
import './JourneyDetails.scss';
import { JourneyDocument } from '@repo/shared';
import LoadingSpinner from '../../../components/UI/Loading';
import Details from '../../../components/shared/RideInfo/Details';
import { Suspense } from 'react';

type Props = {
  params: { slug: string };
};

export default async function JourneyDetailsPage({ params: { slug } }: Props) {
  const res = await getOneJourneyBySlug(slug);

  if (res.status === 404 || !res.data?._id) {
    notFound();
  }

  async function handleBecomeCompanion(ride_id: string, ride_slug: string) {
    'use server';
    return await joinJourney(ride_id, ride_slug);
  }
  return (
    <div className="journey-details">
      {res.data && res.data._id && (
        <Suspense fallback={<LoadingSpinner />}>
          <Details<JourneyDocument>
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
  const res = await getOneJourneyBySlug(slug);
  if (res.status === 404 || !res.data?._id) {
    notFound();
  }
  return {
    title: `Journey: ${res.data?.title}`,
    description: `${res.data?.from} to ${res.data?.to} on ${res.data?.start_date} - ${res.data?.end_date} . Join us for a great journey!`,
  };
}

export async function generateStaticParams() {
  const res = await getAllJourneys();

  if (res.status === 404 || !res.data) {
    return [];
  }

  return res.data.items.map((journey: JourneyDocument) => {
    return {
      slug: journey.slug,
    };
  });
}
