'use client';
import { useCallback, useEffect, useState } from 'react';
import './Pagination.scss';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeftIcon, ArrowRightIcon } from '../../../lib/config/svg';
const listNumberBeVisible = 2;

export default function Pagination({
  total,
  withNumber = false,
  pages = 0,
}: {
  total: number;
  withNumber?: boolean;
  pages?: number;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleChangePage = (value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(value));
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const pageParams = searchParams.get('page');
    if (!pageParams) {
      setCurrentPage(1);
      return;
    }
    if (Number(pageParams) !== currentPage) {
      setCurrentPage(Number(pageParams));
    }
  }, [searchParams]);

  const disableBtn = useCallback(
    (value: number) => {
      return currentPage === value ? 'disabled' : '';
    },
    [currentPage]
  );

  const isVisible = useCallback(
    (value: number) => {
      if (
        (value <= currentPage + listNumberBeVisible &&
          value >= currentPage - listNumberBeVisible &&
          value <= pages) ||
        value === pages
      ) {
        return true;
      }
      return false;
    },
    [currentPage]
  );

  return (
    <div className={`pagination${withNumber ? ' number' : ''}`}>
      <p
        className={`pagination__btn left ${disableBtn(1)}`}
        onClick={() => handleChangePage(currentPage - 1)}
      >
        <ArrowLeftIcon />
        Previous
      </p>

      {withNumber ? (
        <div className='list_number'>
          {Array.from(Array(pages + 1).keys())
            .slice(1)
            .map((value) => (
              <a
                onClick={() => handleChangePage(value)}
                key={value}
                href='#'
                style={{
                  display: isVisible(value) ? '' : 'none',
                }}
                className={currentPage === value ? 'active' : ''}
              >
                {value}
              </a>
            ))}
        </div>
      ) : null}
      <p
        className={`pagination__btn right ${disableBtn(total)}`}
        onClick={() => handleChangePage(currentPage + 1)}
      >
        Next
        <ArrowRightIcon />
      </p>
    </div>
  );
}
