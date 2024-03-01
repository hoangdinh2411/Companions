import { Metadata } from 'next';
import './Journeys.scss';
import Filter from './components/Filter';
import JourneyList from './components/JourneyList';
import {
  filterJourneys,
  getAllJourneys,
  searchJourneys,
} from '../../../actions/journeyApi';
import { Suspense } from 'react';
import LoadingSpinner from '../../../components/UI/Loading';
import { notFound } from 'next/navigation';
import { generateSearchParams } from '../../../lib/utils/generateSearchParams';

export default async function JourneysPage({
  searchParams,
}: {
  searchParams: {
    from: string;
    to: string;
    startDate: string;
    page: number;
    limit: number;
    searchText: string;
  };
}) {
  let params = '';
  let res;
  const { from, to, startDate, searchText } = searchParams;
  if (from && to && startDate) {
    params = generateSearchParams(['from', 'to', 'startDate'], searchParams);
    res = await filterJourneys(params.toString());
  } else if (searchText) {
    params = generateSearchParams(['searchText'], searchParams);
    res = await searchJourneys(params.toString());
  } else {
    params = generateSearchParams(['page', 'limit'], searchParams);

    res = await getAllJourneys(params.toString());
  }

  if (!res.success && res.data?.items.length === 0) {
    notFound();
  }
  return (
    <div className='journeys'>
      <div className='journeys__container'>
        <Filter />
        {!res.success && res.data?.items.length === 0 ? (
          <h1>No journeys found</h1>
        ) : (
          <Suspense fallback={<LoadingSpinner />}>
            <JourneyList data={res.data} />
          </Suspense>
        )}
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Journeys Page',
  description: 'Journeys Page',
};
