'use client';
import Link from 'next/link';
import React, { useEffect, useMemo } from 'react';
import APP_ROUTER from '../../../../lib/config/router';
import { UserIcon } from '../../../../lib/config/svg';
import { removeToken } from '../../../../actions/tokens';
import { toast } from 'react-toastify';
import { usePathname, useRouter } from 'next/navigation';
import appStore from '../../../../lib/store/appStore';
import { GetUserAPIResponse } from '@repo/shared';
import Button from '../../../UI/Button';

export default function Actions({
  userData,
}: {
  userData: GetUserAPIResponse | undefined;
}) {
  const [dropdown, setDropdown] = React.useState(false);
  const { user, setUser } = appStore.getState();
  if (userData && userData._id && !user._id) {
    setUser(userData);
  }
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (dropdown) {
      setDropdown(false);
    }
  }, [pathname]);

  const handleToggleDropdown = () => {
    setDropdown(!dropdown);
  };
  const isLogin = useMemo(() => {
    return userData && userData._id ? false : true;
  }, [userData]);

  const handleLogout = async () => {
    await removeToken();
    if (user?._id) {
      setUser({} as GetUserAPIResponse);
    }
    toast.success('You have successfully signed out');
    router.push(APP_ROUTER.SIGN_IN);
  };

  if (isLogin) {
    return (
      <div className='navbar__actions'>
        <Link href={APP_ROUTER.SIGN_IN}>
          <Button variant='default' className='actions' size='small'>
            Sign in
          </Button>
        </Link>
      </div>
    );
  } else {
    return (
      <div className='navbar__actions'>
        <div className='actions' title='Profile'>
          <p className='actions__icon' onClick={handleToggleDropdown}>
            <UserIcon />
          </p>
          <nav className={`actions__dropdown ${dropdown ? 'open' : ''}`}>
            <ul>
              <li>
                <Link href={APP_ROUTER.PROFILE}>Profile</Link>
              </li>
              <li>
                <p onClick={handleLogout}>Sign out</p>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}
