'use client';
import Link from 'next/link';
import React, { useEffect } from 'react';
import APP_ROUTER from '../../../../lib/config/router';
import { UserIcon } from '../../../../lib/config/svg';
import { getToken, removeToken } from '../../../../actions/tokens';
import { toast } from 'react-toastify';
import { usePathname } from 'next/navigation';

export default function Actions() {
  const [isLogged, setIsLogged] = React.useState(false);
  const [dropdown, setDropdown] = React.useState(false);
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      const token = await getToken();
      if (token) setIsLogged(true);
    }
    checkAuth();
  }, [pathname]);

  const handleDropdown = () => {
    setDropdown(!dropdown);
  };

  const handleLogout = async () => {
    await removeToken();
    setIsLogged(false);
    toast.success('You have successfully signed out');
  };
  return (
    <section className='navbar__actions'>
      {!isLogged ? (
        <Link href={APP_ROUTER.SIGN_IN} className='actions'>
          Sign in
        </Link>
      ) : (
        <div className='actions ' title='Profile'>
          <span onClick={handleDropdown}>
            <UserIcon />
          </span>
          <div className={`actions__dropdown ${dropdown ? 'open' : ''}`}>
            <ul>
              <li>
                <Link href={APP_ROUTER.PROFILE}>Profile</Link>
              </li>
              <li>
                <p onClick={handleLogout}>Sign out</p>
              </li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
