'use client';
import { use, useEffect, useState } from 'react';
import Button from '../../../components/UI/Button';
import {
  DeliveryOrderDocument,
  HistoryAPIResponse,
  JourneyDocument,
} from '@repo/shared';
import { generateSearchParams } from '../../../lib/utils/generateSearchParams';
import { usePathname, useRouter } from 'next/navigation';
import Accordion from '../../../components/UI/Accordion';
import {
  formatToSwedenCurrency,
  formatWeight,
} from '../../../lib/utils/format';
import Pagination from '../../../components/UI/Pagination.tsx';
import appStore from '../../../lib/store/appStore';
import APP_ROUTER from '../../../lib/config/router';
import dayjs from 'dayjs';
import Link from 'next/link';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
type Props = {
  history: HistoryAPIResponse | undefined;
  tab: string;
};
const tabs = [
  {
    label: 'Orders Placed',
    value: 'orders_placed',
  },
  {
    label: 'Orders Taken',
    value: 'orders_taken',
  },
  {
    label: 'Journeys Shared',
    value: 'journeys_shared',
  },
  {
    label: 'Journeys Joined',
    value: 'journeys_joined',
  },
];
export default function History({ history, tab }: Props) {
  const [activeTab, setActiveTab] = useState(tab);
  const router = useRouter();
  const { user } = appStore.getState();
  const pathname = usePathname();
  const handleChangeTab = (tab: string) => {
    const params = generateSearchParams(['page', 'about'], {
      about: tab,
    });
    router.push(`${pathname}?${params}`, {
      scroll: false,
    });
  };

  useEffect(() => {
    if (tab === activeTab) return;
    setActiveTab(tab);
  }, [tab]);

  function isOwner(item_id: string) {
    return user._id && user?._id === item_id;
  }

  function formatDate(date: Date) {
    return dayjs(date).fromNow();
  }
  return (
    <article className='history'>
      <div className='history__container'>
        <h4 className='history__title'>History</h4>
        {activeTab === '' ? (
          <p className='history__empty'>Select a tab to view history</p>
        ) : null}

        <div className='history__tabs'>
          {tabs.map((tab, index) => (
            <Button
              size='small'
              variant={activeTab === tab.value ? 'green' : 'white'}
              style={{
                pointerEvents: activeTab === tab.value ? 'none' : 'auto',
              }}
              className='history__tab'
              key={tab.value}
              onClick={() => handleChangeTab(tab.value)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className='history__contents'>
          {activeTab && history && history.items?.length === 0 ? (
            <p className='history__empty'>No history found</p>
          ) : null}
          {activeTab &&
            history &&
            history.items.length > 0 &&
            history?.pagination && (
              <p>
                {' '}
                Total: {history.pagination.total} - Pages :{' '}
                {history.pagination.pages}
              </p>
            )}
          <br />
          {activeTab &&
            history &&
            history.items?.map(
              (item: JourneyDocument | DeliveryOrderDocument) => {
                return (
                  <Accordion heading={item.title} key={item._id} id={item._id}>
                    <div className='history__item'>
                      {isOwner(item.created_by._id) && (
                        <Link
                          title={
                            item.status === 'completed' ? 'Cannot edit' : 'Edit'
                          }
                          href={
                            (item as DeliveryOrderDocument).weight
                              ? `${APP_ROUTER.EDIT_DELIVERY_ORDER}/${item._id}`
                              : `${APP_ROUTER.EDIT_JOURNEY}/${item._id}`
                          }
                          className='update-btn'
                          style={{
                            color:
                              item.status === 'completed' ? 'gray' : 'initial',
                            pointerEvents:
                              item.status === 'completed' ? 'none' : 'auto',
                          }}
                        >
                          Edit
                        </Link>
                      )}
                      <p className='history__item__title'>
                        {' '}
                        {item?.title}{' '}
                        <span
                          className={`history__item__status ${item.status}`}
                        >
                          {item.status.toUpperCase()}
                        </span>
                      </p>
                      <article className='history__item__boxes'>
                        From: <span>{item?.from}</span>
                      </article>
                      <article className='history__item__boxes'>
                        To: <span>{item?.to}</span>
                      </article>
                      <article className='history__item__boxes'>
                        Start: <span>{item?.start_date}</span>
                      </article>
                      <article className='history__item__boxes'>
                        End: <span>{item?.end_date}</span>
                      </article>

                      {(item as DeliveryOrderDocument).weight && (
                        <article className='history__item__boxes'>
                          Weight:{' '}
                          <span>
                            {formatWeight(
                              (item as DeliveryOrderDocument).weight
                            )}
                          </span>
                        </article>
                      )}
                      {(item as DeliveryOrderDocument).type_of_commodity && (
                        <article className='history__item__boxes'>
                          Type Of Commodity:{' '}
                          <span>
                            {(
                              item as DeliveryOrderDocument
                            )?.type_of_commodity?.toUpperCase()}{' '}
                          </span>
                        </article>
                      )}

                      {(item as DeliveryOrderDocument).size && (
                        <article className='history__item__boxes'>
                          Size:{' '}
                          <span>
                            {(item as DeliveryOrderDocument)?.size ?? ''}{' '}
                            (length - width - height){' '}
                          </span>
                        </article>
                      )}
                      {(item as JourneyDocument).seats && (
                        <article className='history__item__boxes'>
                          Seats: <span>{(item as JourneyDocument).seats}</span>
                        </article>
                      )}

                      <article className='history__item__boxes'>
                        Price: <span>{formatToSwedenCurrency(item.price)}</span>
                      </article>
                      <article className='history__item__boxes history__item__boxes--message'>
                        Message:{' '}
                        <div>
                          {!item?.message ? (
                            "(don't have any message for this journey yet!)"
                          ) : (
                            <blockquote>
                              <p>{item?.message} </p>
                            </blockquote>
                          )}
                        </div>
                      </article>
                      {item.updated_at && item.created_at && (
                        <article className='history__item__boxes history__item__boxes--created-at '>
                          <span>
                            {formatDate(
                              item.created_by._id === user._id
                                ? item.created_at
                                : item.updated_at
                            )}{' '}
                            {item.created_at < item.updated_at &&
                            item.created_by._id === user._id
                              ? '(Edited)'
                              : ''}{' '}
                          </span>
                        </article>
                      )}
                    </div>
                  </Accordion>
                );
              }
            )}

          {activeTab &&
            history &&
            history.items.length > 0 &&
            history?.pagination && (
              <Pagination
                total={history?.pagination.total || 0}
                pages={history?.pagination.pages || 0}
                withNumber
              />
            )}
        </div>
      </div>
    </article>
  );
}
