import LoadingSpinner from '../components/UI/Loading';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className='global-loading'>
      <LoadingSpinner />;
    </div>
  );
}
