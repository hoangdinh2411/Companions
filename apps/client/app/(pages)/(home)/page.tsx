import { Metadata } from 'next';
import Slide from '../../components/shared/Slide/Slide';
import './Home.scss';
import Goals from './components/Goals';
import Statistical from './components/Statistical';
import Comments from './components/Comments';

export default function Page(): JSX.Element {
  return (
    <>
      <Slide />
      <Goals />
      <Statistical />
      <Comments />
    </>
  );
}

export const metadata: Metadata = {
  title: 'Searching posters',
  description: 'Search for posters',
};
