'use client';
import React from 'react';
import Button from '../../../components/UI/Button';
import { HistoryAPIResponse } from '@repo/shared';

type Props = {
  data: HistoryAPIResponse;
};
const tabs = [
  'Orders Placed',
  'Orders Taken',
  'Journeys Shared',
  'Journeys Joined',
];
export default function History({}: Props) {
  const [activeTab, setActiveTab] = React.useState(0);

  const handleChangeTab = (index: number) => {
    setActiveTab(index);
  };
  return (
    <article className='history'>
      <div className='history__container'>
        <div className='history__tabs'>
          {tabs.map((tab, index) => (
            <Button
              size='small'
              variant={activeTab === index ? 'green' : 'white'}
              style={{
                pointerEvents: activeTab === index ? 'none' : 'auto',
              }}
              className='history__tab'
              key={index}
              onClick={() => handleChangeTab(index)}
            >
              {tab}
            </Button>
          ))}
        </div>
        <div className='history__contents'></div>
      </div>
    </article>
  );
}
