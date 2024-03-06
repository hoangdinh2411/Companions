import { Metadata } from 'next';
import './Profile.scss';
import { getUser } from '../../actions/userApi';
import { notFound } from 'next/navigation';

export default async function ProfilePage() {
  const res = await getUser();

  if (!res.data || !res.data._id) {
    notFound();
  }
  const user = res.data;
  return (
    <section className='profile'>
      <article className='profile__container'>
        <div className='profile__detail cards'>
          <h4 className='profile__title'>Profile</h4>
          <p className='content__item'>
            Full name:
            <span className='content__value'>{user.full_name}</span>
          </p>
          <p className='content__item'>
            Email:
            <span className='content__value'>{user.email}</span>
          </p>
          <p className='content__item'>
            Phone:
            <span className='content__value'>{user.phone}</span>
          </p>
        </div>
        <div className='profile__statistic cards'>
          <p className='content__item'>
            Orders placed:
            <span className='content__value'>
              {user.total_orders_placed ?? 0}
            </span>
          </p>
          <p className='content__item'>
            Orders received:
            <span className='content__value'>
              {user.total_orders_taken ?? 0}
            </span>
          </p>
          <p className='content__item'>
            Journeys shared:
            <span className='content__value'>
              {user.total_journeys_shared ?? 0}
            </span>
          </p>
          <p className='content__item'>
            Journeys joined:
            <span className='content__value'>
              {user.total_journeys_joined ?? 0}
            </span>
          </p>
        </div>
      </article>
    </section>
  );
}

export const metadata: Metadata = {
  title: 'Profile page',
  description: 'The page where you can see your profile.',
};
