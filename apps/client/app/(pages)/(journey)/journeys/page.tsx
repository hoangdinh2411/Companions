import { Metadata } from 'next';
import './Journeys.scss';
import Link from 'next/link';
import Filter from './components/Filter';
import APP_ROUTER from '../../../lib/config/router';
import { GreenCarpoolingIcon } from '../../../lib/config/svg';

const data = {
  title: 'Journeys Page',
  from: 'Helsingborg',
  to: 'Stockholm',
  date: '2021-09-01',
};
const arrays = Array(12).fill(data);
export default function JourneysPage() {
  return (
    <div className='journeys'>
      {/* <div className='journeys__banner'></div> */}
      <div className='journeys__container'>
        <Filter />
        <section className='journeys__list'>
          {arrays.map((item, index) => (
            <article className='journeys__cards' key={index}>
              <Link href={`${APP_ROUTER.JOURNEYS}/${index}`} className='card'>
                <div className='card__icon'>
                  <GreenCarpoolingIcon />
                </div>
                <div className='card__content'>
                  <p className='title'>{item.title}</p>
                  <p className='route'>
                    {item.from} - {item.to}
                  </p>
                  <span className='date'>{item.date}</span>
                </div>
              </Link>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Journeys Page',
  description: 'Journeys Page',
};
