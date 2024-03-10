import { Metadata } from 'next';
import Slide from './components/Slide/Slide';
import './Home.scss';
import Goals from './components/Goals';
import Statistical from './components/Statistical';
import Comments from './components/Comments';
import Accordion from '../../components/UI/Accordion';
import { fetchStatisticsAndUpdateStatusOldDocuments } from '../../actions/appApi';
import { Suspense } from 'react';

export default function HomePage(): JSX.Element {
  const getStatisticPromise = fetchStatisticsAndUpdateStatusOldDocuments();
  return (
    <>
      <Slide />
      <Goals />
      <Suspense fallback={<div>Loading...</div>}>
        <Statistical getStatisticPromise={getStatisticPromise} />
      </Suspense>
      <Comments />
    </>
  );
}

export const metadata: Metadata = {
  title: 'Searching posters',
  description: 'Search for posters',
};
