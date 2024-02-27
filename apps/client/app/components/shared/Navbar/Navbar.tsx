'use client';
import React, { useEffect } from 'react';
import './Navbar.scss';
import Menu from './Menu';
import { MenuCloseIcon, MenuIcon } from '../../../lib/config/svg';
import Logo from '../Logo/Logo';
import Actions from './Actions';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [showMenu, setShowMenu] = React.useState(false);
  const pathname = usePathname();
  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  useEffect(() => {
    if (showMenu) handleCloseMenu();
  }, [pathname]);
  return (
    <nav className='navbar'>
      <span className='menubar-icon' onClick={() => setShowMenu(!showMenu)}>
        {showMenu ? <MenuCloseIcon /> : <MenuIcon />}
      </span>
      <Logo />
      <Menu showMenu={showMenu} handleCloseMenu={handleCloseMenu} />
      <Actions />
    </nav>
  );
}
