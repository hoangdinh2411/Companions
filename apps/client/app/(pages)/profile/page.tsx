import { Metadata } from 'next';
import './Profile.scss';
import { getHistory, getUser } from '../../actions/userApi';
import { generateSearchParams } from '../../lib/utils/generateSearchParams';
import dynamic from 'next/dynamic';
import LoadingSpinner from '../../components/UI/Loading';
import Detail from './components/Detail';
const History = dynamic(() => import('./components/History'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const getUserPromise = getUser();

  const params = generateSearchParams(
    ['page', 'about', 'search_text'],
    searchParams
  );
  let historyData;
  if (searchParams.about) {
    historyData = await getHistory(params);
  }
  return (
    <section className="profile">
      <Detail getUserPromise={getUserPromise} />
      <History history={historyData?.data} tab={searchParams.about || ''} />
    </section>
  );
}

export const metadata: Metadata = {
  title: 'Profile page',
  description: 'The page where you can see your profile.',
};
