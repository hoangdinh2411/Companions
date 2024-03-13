import './Navbar.scss';
import Menu from './Menu';
import Logo from '../Logo/Logo';
import Actions from './Actions';
import MenuBar from './MenuBar';
import { getToken } from '../../../actions/tokens';
import { getUser } from '../../../actions/userApi';

export default async function Navbar() {
  const token = await getToken();
  let res;

  if (token) {
    res = await getUser();
  }
  return (
    <header className='navbar'>
      <MenuBar />
      <Logo />
      <Menu />
      <Actions userData={res?.data && res.data._id ? res?.data : undefined} />
    </header>
  );
}
