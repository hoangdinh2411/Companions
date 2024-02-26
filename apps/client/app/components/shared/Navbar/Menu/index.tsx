'use client';
import React from 'react';
import { NAVBAR } from '../../../../lib/config/router';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function Menu({
  showMenu,
  handleCloseMenu,
}: {
  showMenu: boolean;
  handleCloseMenu: () => void;
}) {
  const pathname = usePathname();

  return (
    <ul className={`navbar__menu ${showMenu ? 'open' : ''}`}>
      <span className='menu__overlay' onClick={handleCloseMenu}></span>
      {NAVBAR.map((item) => (
        <li
          key={item.path}
          className={`items ${pathname.endsWith(item.path) ? 'active' : ''} `}
        >
          <Link href={item.path} className='items__link'>
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
