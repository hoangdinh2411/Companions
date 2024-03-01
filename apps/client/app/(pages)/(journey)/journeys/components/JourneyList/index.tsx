import { JourneyResponse } from '@repo/shared';
import React from 'react';
import JourneyCard from './JourneyCard';
import Pagination from '../../../../../components/UI/Pagination.tsx';
type Props = {
  data: JourneyResponse | undefined;
};

export default function JourneyList({ data }: Props) {
  return (
    <>
      <section className='journeys__list'>
        {data &&
          data.items?.map((item, index) => (
            <JourneyCard journey={item} key={index} />
          ))}
      </section>
      {data && data.pagination && (
        <Pagination total={data ? data.pagination.pages : 1} />
      )}
    </>
  );
}
