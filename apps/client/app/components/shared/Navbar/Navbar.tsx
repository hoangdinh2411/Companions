import './Navbar.scss';
import Menu from './Menu';
import Logo from '../Logo/Logo';
import MenuBar from './MenuBar';
import Actions from './Actions';

export default function Navbar() {
  return (
    <header className="navbar">
      <MenuBar />
      <Logo />
      <Menu />
      <Actions />
    </header>
  );
}
