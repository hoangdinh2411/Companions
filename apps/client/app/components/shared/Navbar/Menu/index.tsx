'use client';
import { NAVBAR } from '../../../../lib/config/router';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function Menu() {
  const pathname = usePathname();
  return (
    <ul className={`navbar__menu `}>
      {NAVBAR.map((item) => (
        <li
          key={item.path}
          className={`items ${pathname.endsWith(item.path) ? 'active' : ''} `}
        >
          <Link href={item.path} className="items__link">
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
