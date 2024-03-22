'use client';
import Link from 'next/link';
import React, { useEffect } from 'react';
import APP_ROUTER from '../../../../lib/config/router';
import { UserIcon } from '../../../../lib/config/svg';
import { usePathname, useRouter } from 'next/navigation';
import { GetUserAPIResponse } from '@repo/shared';
import { getUser, signOut } from '../../../../actions/userApi';
import Button from '../../../UI/Button';
import { useAppContext } from '../../../../lib/provider/AppContextProvider';
import { useSocketContext } from '../../../../lib/provider/SocketContextProvider';

export default function Actions() {
  const { socketConnection, handleSetSocketConnection } = useSocketContext();
  const [dropdown, setDropdown] = React.useState(false);
  const { user, handleSetUser } = useAppContext();

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (dropdown) {
      setDropdown(false);
    }
  }, [pathname]);
  useEffect(() => {
    if (user?._id) return;
    getUser().then((res) => {
      if (res.data) {
        handleSetUser(res.data);
      }
    });
  }, []);

  const handleToggleDropdown = () => {
    setDropdown(!dropdown);
  };

  const handleLogout = async () => {
    await signOut();
    if (user?._id) {
      handleSetUser({} as GetUserAPIResponse);
    }
    if (socketConnection) {
      socketConnection.disconnect();
      handleSetSocketConnection(null as any);
    }

    router.push(APP_ROUTER.SIGN_IN);
  };

  return (
    <div className="navbar__actions">
      {!user?._id ? (
        <Link href={APP_ROUTER.SIGN_IN}>
          <Button variant="default" className="actions" size="small">
            Sign in
          </Button>
        </Link>
      ) : (
        <div className="actions" title="Profile">
          <p className="actions__icon" onClick={handleToggleDropdown}>
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
      )}
    </div>
  );
}
