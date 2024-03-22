import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import APP_ROUTER from '../../lib/config/router';
import { notFound } from 'next/navigation';

export default async function page({
  searchParams: { email },
}: {
  searchParams: Record<string, string>;
}) {
  if (!email) {
    notFound();
  }
  return (
    <div>
      <h4>
        An email has been sent to your email address. Please verify your email
        address to continue. Please verify your email address to continue.
      </h4>
      <Link href={APP_ROUTER.SIGN_IN}>Has an account? Sign in</Link>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Success Page',
  description:
    'An email has been sent to your email address. Please verify your email address to continue.',
};
