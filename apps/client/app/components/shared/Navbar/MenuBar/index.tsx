'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MenuCloseIcon, MenuIcon } from '../../../../lib/config/svg';

type Props = {};

export default function MenuBar({}: Props) {
  const [menubar, setMenuBar] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    if (!menubar) return;
    setMenuBar(false);
  }, [pathname]);

  return (
    <>
      <span className='menubar-icon' onClick={() => setMenuBar(!menubar)}>
        {menubar ? <MenuCloseIcon /> : <MenuIcon />}
      </span>
      <input hidden type='checkbox' id='menubar' checked={menubar} readOnly />
      <span
        className='menu__overlay'
        onClick={() => {
          setMenuBar(false);
        }}
      ></span>
    </>
  );
}
