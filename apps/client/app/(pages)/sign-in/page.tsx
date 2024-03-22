import { Metadata } from 'next';
import './SignIn.scss';
import Form from './Form';
import Image from 'next/image';

export default function SignInPage(): JSX.Element {
  return (
    <article className="sign-in-page">
      <div className="form__container">
        <figure className="form__image">
          <Image
            src="/goals.png"
            alt="sign in image"
            fill
            sizes="(max-width:992px) 500px 350px"
          />
        </figure>
        <Form />
      </div>
    </article>
  );
}

export const metadata: Metadata = {
  title: 'Sign in to your account',
  description: 'Sign in to your account',
};
