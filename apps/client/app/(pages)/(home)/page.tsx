import { Metadata } from 'next';
import Slide from './components/Slide/Slide';
import './Home.scss';
import Goals from './components/Goals';
import { Suspense } from 'react';
import LoadingSpinner from '../../components/UI/Loading';
import Comments from './components/Comments';
import Statistical from './components/Statistical';

export default function HomePage(): JSX.Element {
  return (
    <>
      <Slide />
      <Goals />
      <Statistical />
      <Suspense fallback={<LoadingSpinner />}>
        <Comments />
      </Suspense>
    </>
  );
}

export const metadata: Metadata = {
  title: 'Searching posters',
  description: 'Search for posters',
};
