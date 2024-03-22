'use client';
import React from 'react';
import TextField from '../../UI/TextField';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchIcon } from '../../../lib/config/svg';
import './SearchField.scss';

export default function SearchField({
  combinable = false,
}: {
  combinable?: boolean;
}) {
  const router = useRouter();
  const searchRef = React.useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function generateSearchParams() {
    const params = new URLSearchParams();
    const currentParams = new URLSearchParams(searchParams.toString());
    if (searchRef.current?.value === '') {
      currentParams.forEach((value, key) => {
        if (key === 'search_text') return;
        params.set(key, value);
      });
      router.push(pathname + '?' + params.toString(), {
        scroll: false,
      });
      return;
    }

    const searchValue = searchRef.current?.value;
    if (searchValue) {
      params.append('search_text', searchValue);
      params.append('page', '1');
    }

    if (combinable) {
      currentParams.forEach((value, key) => {
        if (key === 'page') return;
        params.set(key, value);
      });
    }

    router.push(pathname + '?' + params.toString(), {
      scroll: false,
    });
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
      <div className="search-field">
        <TextField
          placeholder="Search..."
          ref={searchRef}
          onKeyDown={handleEnter}
        />
        <span className="search__icon" onClick={handleClick}>
          <SearchIcon />
        </span>
      </div>
    </>
  );
}
