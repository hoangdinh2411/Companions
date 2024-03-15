import { Metadata } from 'next';
import {
  getAllJourneys,
  getOneJourneyBySlug,
} from '../../../actions/journeyApi';
import { notFound } from 'next/navigation';
import './JourneyDetails.scss';
import { JourneyDocument } from '@repo/shared';
import dynamic from 'next/dynamic';
import LoadingSpinner from '../../../components/UI/Loading';

const Details = dynamic(() => import('./components/Details'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});
const Creator = dynamic(() => import('./components/Creator'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

type Props = {
  params: { slug: string };
};

export default async function JourneyDetailsPage({ params: { slug } }: Props) {
  const res = await getOneJourneyBySlug(slug);

  if (res.status === 404 || !res.data?._id) {
    notFound();
  }

  return (
    <div className="journey-details">
      {res.data && res.data._id && (
        <div className="journey-details__container">
          <Details journey={res.data} />
          <Creator journey={res.data} />
        </div>
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
