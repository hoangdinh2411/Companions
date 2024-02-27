import { Metadata } from 'next';
import './SignUp.scss';
import Form from './Form';
import Image from 'next/image';

export default function SignUpPage(): JSX.Element {
  return (
    <article className='sign-up-page'>
      <div className='form__container'>
        <figure className='form__image'>
          <Image
            src='/slide_carpooling.jpg'
            alt='sign up image'
            fill
            sizes='(max-width:992px) 500px 350px'
          />
        </figure>
        <Form />
      </div>
    </article>
  );
}

export const metadata: Metadata = {
  title: 'Sign up for an account',
  description: 'Sign up for an account',
};
