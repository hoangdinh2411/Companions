import './Comments.scss';

import { getNewestComments } from '../../../../actions/commentApi';
import dynamic from 'next/dynamic';
import LoadingSpinner from '../../../../components/UI/Loading';
import { Suspense } from 'react';

const List = dynamic(() => import('./List'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

const CommentForm = dynamic(() => import('./CommentForm'), {
  ssr: false,
});

export default async function Comments() {
  const res = await getNewestComments();
  const data = res?.data ?? {
    items: [],
    pagination: {
      pages: 1,
      total: 0,
    },
  };

  return (
    <section className='comments'>
      <div className='comments__container'>
        <CommentForm />
        <Suspense fallback={<LoadingSpinner />}>
          <List data={data} />
        </Suspense>
      </div>
    </section>
  );
}
