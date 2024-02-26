import Link from 'next/link';
import React from 'react';
import APP_ROUTER from '../../../../lib/config/router';

export default function Actions() {
  return (
    <section className='navbar__actions'>
      <Link href={APP_ROUTER.LOGIN} className='actions'>
        Login
      </Link>
      <Link href={APP_ROUTER.LOGIN} className='actions'>
        Register
      </Link>
    </section>
  );
}
