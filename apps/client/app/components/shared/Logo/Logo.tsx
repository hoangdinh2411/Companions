import React from 'react';
import APP_ROUTER from '../../../lib/config/router';
import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <Link href={APP_ROUTER.HOME} className='navbar__logo' title='Companions'>
      <Image
        src='/logo.png'
        alt='logo'
        fill
        priority
        sizes='52px , (max-width:992px) 120px '
      />
    </Link>
  );
}
