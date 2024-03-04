import { Metadata } from 'next';
import './Journeys.scss';
import SearchBar from './components/SearchBar';
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
import Pagination from '../../../components/UI/Pagination.tsx';

export default async function JourneysPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  let params = '';
  let res;
  const { from, to, start_date, search_text, page } = searchParams;
  if (from && to && start_date) {
    params = generateSearchParams(
      ['from', 'to', 'start_date', 'page'],
      searchParams
    );
    res = await filterJourneys(params.toString());
  } else if (search_text) {
    params = generateSearchParams(['search_text', 'page'], searchParams);
    res = await searchJourneys(params.toString());
  } else {
    params = generateSearchParams(['page'], searchParams);
    res = await getAllJourneys(params.toString());
  }

  return (
    <div className='journeys'>
      <div className='journeys__container'>
        {search_text || from || to || start_date ? (
          <strong>Empty search field for fetching newest journeys</strong>
        ) : null}
        <SearchBar />
        <Suspense fallback={<LoadingSpinner />}>
          <JourneyList data={res.data} />
        </Suspense>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Journeys Page',
  description: 'Journeys Page',
};
