'use client';
import Link from 'next/link';
import React, { useEffect, useMemo } from 'react';
import APP_ROUTER from '../../../../lib/config/router';
import { UserIcon } from '../../../../lib/config/svg';
import {
  getToken,
  removeIdentifyNumber,
  removeToken,
} from '../../../../actions/tokens';
import { toast } from 'react-toastify';
import { usePathname, useRouter } from 'next/navigation';
import { getUser } from '../../../../actions/userApi';
import appStore from '../../../../lib/store/appStore';
import { UserDocument } from '@repo/shared';
import Button from '../../../UI/Button';

export default function Actions() {
  const [dropdown, setDropdown] = React.useState(false);
  const { user, setUser } = appStore.getState();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (dropdown) {
      setDropdown(false);
    }

    async function checkAuth() {
      const token = await getToken();
      if (!token) {
        if (user?._id) {
          setUser({} as UserDocument);
        }
        return;
      }
      const res = await getUser();
      if (!user._id && res.success && res.data?._id) {
        setUser(res.data);
        router.refresh();
      }
      if (user._id && res.status === 401) {
        removeToken();
        removeIdentifyNumber();
        setUser({} as UserDocument);
        return;
      }
    }

    checkAuth();
  }, [pathname]);

  const handleDropdown = () => {
    setDropdown(!dropdown);
  };
  const isLogin = useMemo(() => {
    return user._id ? false : true;
  }, [user]);

  const handleLogout = async () => {
    await removeToken();
    if (user?._id) {
      setUser({} as UserDocument);
    }
    toast.success('You have successfully signed out');
  };

  const redirectToSignIn = () => {
    router.push(APP_ROUTER.SIGN_IN);
  };
  return (
    <section className='navbar__actions'>
      {isLogin ? (
        <Button
          variant='default'
          onClick={redirectToSignIn}
          className='actions'
          size='small'
        >
          Sign in
        </Button>
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
