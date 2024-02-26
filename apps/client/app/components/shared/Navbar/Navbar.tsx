'use client';
import React from 'react';
import './Navbar.scss';
import Menu from './Menu';
import { MenuCloseIcon, MenuIcon } from '../../../lib/config/svg';
import Logo from '../Logo/Logo';
import Actions from './Actions';

export default function Navbar() {
  const [showMenu, setShowMenu] = React.useState(false);

  const handleCloseMenu = () => {
    setShowMenu(false);
  };
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
