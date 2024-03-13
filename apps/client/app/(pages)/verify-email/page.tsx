import { Metadata } from 'next';
import React from 'react';
import { verifyAccount } from '../../actions/userApi';
import APP_ROUTER from '../../lib/config/router';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: Record<string, string>;
};

export default async function page({
  searchParams: { confirm, email },
}: Props) {
  if (!confirm || !email) {
    redirect(APP_ROUTER.HOME);
  }
  const res = await verifyAccount(confirm, email);

  return (
    <div>
      <h4>Email Verified</h4>
      <p>{res.message}</p>
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Verify Email',
  description: 'Verify Email',
};
