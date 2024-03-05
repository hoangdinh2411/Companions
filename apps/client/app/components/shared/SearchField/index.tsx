'use client';
import React from 'react';
import TextField from '../../UI/TextField';
import { usePathname, useRouter } from 'next/navigation';
import { SearchIcon } from '../../../lib/config/svg';
import './SearchField.scss';

export default function SearchField() {
  const router = useRouter();
  const searchRef = React.useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  function generateSearchParams() {
    const params = new URLSearchParams();
    if (searchRef.current?.value === '') {
      router.push(pathname + '?page=1');
      return;
    }
    const searchValue = searchRef.current?.value;
    if (searchValue) {
      params.append('search_text', searchValue);
      params.append('page', '1');
    }
    router.push(pathname + '?' + params.toString());
  }
  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    generateSearchParams();
  };
  const handleClick = () => {
    generateSearchParams();
  };

  return (
    <>
      <div className='search-field'>
        <TextField
          placeholder='Search...'
          ref={searchRef}
          onKeyDown={handleEnter}
        />
        <span className='search__icon' onClick={handleClick}>
          <SearchIcon />
        </span>
      </div>
    </>
  );
}
