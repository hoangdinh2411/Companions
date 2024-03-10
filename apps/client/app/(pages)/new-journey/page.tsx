import { Metadata } from 'next';
import JourneyForm from '../../components/shared/Forms/journey/JourneyForm';

export default function NewJourneyPage() {
  return (
    <JourneyForm
      heading='Share your journey'
      style={{
        padding: '12rem 0',
      }}
    />
  );
}

export const metadata: Metadata = {
  title: 'Journeys Page',
  description: 'Journeys Page',
};
