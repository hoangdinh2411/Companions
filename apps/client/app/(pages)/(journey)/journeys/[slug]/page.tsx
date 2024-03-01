import { Metadata, ResolvingMetadata } from 'next';
import { getAllJourneys } from '../../../../actions/journeyApi';

type Props = {
  params: { slug: string };
};

export default function JourneyPage({ params: { slug } }: Props) {
  return <div>{slug}</div>;
}

export async function generateMetadata(
  { params: { slug } }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: `Journey: ${slug}`,
  };
}

export async function generateStaticParams() {
  const res = await getAllJourneys();

  return (
    res.success &&
    res.data &&
    res.data.items.map((journey) => ({
      slug: journey.slug,
    }))
  );
}
