import { Metadata } from 'next';
import './Profile.scss';
import { getHistory, getUser } from '../../actions/userApi';
import { notFound } from 'next/navigation';
import History from './components/History';
import { generateSearchParams } from '../../lib/utils/generateSearchParams';
import { Suspense } from 'react';
import Detail from './components/Detail';
import LoadingSpinner from '../../components/UI/Loading';
export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const getUserPromise = getUser();

  const params = generateSearchParams(['page', 'about'], searchParams);
  let historyData;
  if (searchParams.about) {
    historyData = await getHistory(params);
  }
  return (
    <section className='profile'>
      <Detail getUserPromise={getUserPromise} />
      <Suspense fallback={<LoadingSpinner />}>
        <History history={historyData?.data} tab={searchParams.about || ''} />
      </Suspense>
    </section>
  );
}

export const metadata: Metadata = {
  title: 'Profile page',
  description: 'The page where you can see your profile.',
};
