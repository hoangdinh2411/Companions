'use client';
import React from 'react';
import TextField from '../../../../components/UI/TextField';
import Button from '../../../../components/UI/Button';
import { SearchIcon } from '../../../../lib/config/svg';
import { get } from 'http';
import { getToken } from '../../../../actions/tokens';
import { useRouter } from 'next/navigation';
import APP_ROUTER from '../../../../lib/config/router';
import { toast } from 'react-toastify';

export default function Filter() {
  const router = useRouter();
  const searchRef = React.useRef<HTMLInputElement>(null);

  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    console.log(searchRef.current?.value);
  };
  const handleClick = (e: React.MouseEvent) => {
    console.log(searchRef.current?.value);
  };

  const handleRedirectToAddNew = async () => {
    const token = await getToken();
    if (token) {
      router.push(APP_ROUTER.ADD_NEW_JOURNEY);
    } else {
      toast.warning('Please sign in to continue');
      router.push(APP_ROUTER.SIGN_IN);
    }
  };
  return (
    <section className='journeys__filter'>
      <div className='filter__search'>
        <div className='search'>
          <TextField
            placeholder='Search...'
            ref={searchRef}
            onKeyDown={handleEnter}
          />
          <span className='search__icon' onClick={handleClick}>
            <SearchIcon />
          </span>
        </div>
        <div className='journeys__add-new'>
          <Button onClick={handleRedirectToAddNew}>New Journey</Button>
        </div>
      </div>
    </section>
  );
}
