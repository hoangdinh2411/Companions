import { Metadata } from 'next';
import './NewJourney.scss';
import Form from './components/Form';

export default function NewJourneyPage() {
  return (
    <section className='new-journey'>
      <div className='new-journey__container'>
        <h3>Share your journey</h3>
        <Form />
      </div>
    </section>
  );
}

export const metadata: Metadata = {
  title: 'Journeys Page',
  description: 'Journeys Page',
};
