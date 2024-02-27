import Link from 'next/link';
import React from 'react';
import APP_ROUTER from '../../../../lib/config/router';

export default function Actions() {
  return (
    <section className='navbar__actions'>
      <Link href={APP_ROUTER.SIGN_IN} className='actions'>
        Sign in
      </Link>
    </section>
  );
}
