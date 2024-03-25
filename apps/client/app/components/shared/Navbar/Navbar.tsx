import './Navbar.scss';
import Menu from './Menu';
import Logo from '../Logo/Logo';
import MenuBar from './MenuBar';
import Actions from './Actions';
import { getUser } from '../../../actions/userApi';

export default async function Navbar() {
  return (
    <header className="navbar">
      <MenuBar />
      <Logo />
      <Menu />
      <Actions />
    </header>
  );
}
