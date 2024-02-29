'use client';
import React from 'react';
import { get } from 'http';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { getToken } from '../../../../../actions/tokens';
import APP_ROUTER from '../../../../../lib/config/router';
import TextField from '../../../../../components/UI/TextField';
import { SearchIcon } from '../../../../../lib/config/svg';
import Button from '../../../../../components/UI/Button';

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
