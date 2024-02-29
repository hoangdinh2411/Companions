import { Metadata } from 'next';

export default function JourneyPage({
  params: { id },
}: {
  params: { id: string };
}) {
  return <div>{id}</div>;
}

export const metadata: Metadata = {
  title: 'Journeys Page',
  description: 'Journeys Page',
};
