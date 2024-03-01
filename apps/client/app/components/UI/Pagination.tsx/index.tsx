'use client';
import React, { useCallback, useEffect, useState } from 'react';
import './Pagination.scss';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeftIcon, ArrowRightIcon } from '../../../lib/config/svg';
import { generateSearchParams } from '../../../lib/utils/generateSearchParams';

export default function Pagination({ total }: { total: number }) {
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const handleChangePage = (value: number) => {
    const params = generateSearchParams(['page'], {
      page: currentPage + value,
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const pageParams = searchParams.get('page');
    if (Number(pageParams) === currentPage) return;
    if (!pageParams) return;
    setCurrentPage(Number(pageParams));
  }, []);

  const disableBtn = useCallback(
    (value: number) => {
      return currentPage === value ? 'disabled' : '';
    },
    [currentPage]
  );

  return (
    <div className='pagination'>
      <p
        className={`pagination__btn left ${disableBtn(1)}`}
        onClick={() => handleChangePage(-1)}
      >
        <ArrowLeftIcon />
        Previous
      </p>
      <p
        className={`pagination__btn right ${disableBtn(total)}`}
        onClick={() => handleChangePage(1)}
      >
        Next
        <ArrowRightIcon />
      </p>
    </div>
  );
}
