'use client';
import { useTransition, useEffect, useState } from 'react';
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
import APP_ROUTER from '../../../lib/config/router';

import Link from 'next/link';

import {
  deleteJourney,
  updateStatusJourney,
} from '../../../actions/journeyApi';
import {
  deleteOrder,
  updateStatusOrder,
} from '../../../actions/deliveryOrderApi';
import SearchField from '../../../components/shared/SearchField';
import { useAppContext } from '../../../lib/provider/AppContextProvider';
import useSocket from '../../../hooks/useSocket';
import dayjsConfig from '../../../lib/config/dayjsConfig';

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
  const { createRoom } = useSocket();
  const router = useRouter();
  const { user } = useAppContext();
  const [isPending, startTransition] = useTransition();
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
    return dayjsConfig(date).fromNow();
  }

  async function updateStatusForDocument(
    id: string,
    slug: string,
    type_collection: string
  ) {
    startTransition(async function () {
      if (type_collection === 'journey') {
        await updateStatusJourney(id, slug);
      }
      if (type_collection === 'delivery_order') {
        await updateStatusOrder(id, slug);
      }
    });
  }
  async function deleteDocument(
    id: string,
    slug: string,
    type_collection: string
  ) {
    startTransition(async function () {
      if (type_collection === 'journey') {
        await deleteJourney(id, slug);
      }
      if (type_collection === 'delivery_order') {
        await deleteOrder(id, slug);
      }
    });
  }

  return (
    <article className="history">
      <div className="history__container">
        <h4 className="history__title">History</h4>
        {activeTab === '' ? (
          <p className="history__empty">Select a tab to view history</p>
        ) : (
          <SearchField combinable />
        )}

        <div className="history__tabs">
          {tabs.map((tab) => (
            <Button
              size="small"
              variant={activeTab === tab.value ? 'green' : 'white'}
              className="history__tab"
              key={tab.value}
              onClick={() => handleChangeTab(tab.value)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="history__contents">
          {activeTab && history && history.items?.length === 0 ? (
            <p className="history__empty">No history found</p>
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
                    <div className="history__item">
                      {isOwner(item.created_by._id) ? (
                        <div className="update-btn">
                          <Link
                            title={
                              item.status === 'completed'
                                ? 'Cannot edit'
                                : 'Edit'
                            }
                            href={
                              (item as DeliveryOrderDocument).weight
                                ? `${APP_ROUTER.EDIT_DELIVERY_ORDER}/${item._id}`
                                : `${APP_ROUTER.EDIT_JOURNEY}/${item._id}`
                            }
                            style={{
                              color:
                                item.status === 'completed'
                                  ? 'gray'
                                  : 'initial',
                              pointerEvents:
                                item.status === 'completed' ? 'none' : 'auto',
                            }}
                          >
                            Edit
                          </Link>
                          {isPending ? (
                            <span>Updating...</span>
                          ) : (
                            <>
                              <span
                                onClick={() =>
                                  updateStatusForDocument(
                                    item._id,
                                    item.slug,
                                    (item as DeliveryOrderDocument).weight
                                      ? 'delivery_order'
                                      : 'journey'
                                  )
                                }
                              >
                                {item.status === 'completed' ? 'Open' : 'Close'}
                              </span>
                            </>
                          )}

                          {item.status !== 'completed' && (
                            <span
                              onClick={() =>
                                deleteDocument(
                                  item._id,
                                  item.slug,
                                  (item as DeliveryOrderDocument).weight
                                    ? 'delivery_order'
                                    : 'journey'
                                )
                              }
                            >
                              Delete
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="update-btn">
                          <Button
                            size="small"
                            variant="white"
                            onClick={() => {
                              createRoom(item.created_by._id);
                            }}
                          >
                            Send message
                          </Button>
                        </div>
                      )}
                      <p className="history__item__title">
                        {' '}
                        <Link
                          className="history__item__title__link"
                          href={
                            (item as DeliveryOrderDocument).weight
                              ? `${APP_ROUTER.DELIVERY_ORDERS}/${item.slug}`
                              : `${APP_ROUTER.JOURNEYS}/${item.slug}`
                          }
                        >
                          {item?.title}{' '}
                        </Link>
                        <span
                          className={`history__item__status ${item.status}`}
                        >
                          {item.status.toUpperCase()}
                        </span>
                      </p>

                      {/* Creator detial */}
                      <details
                        className="history__item__boxes history__item__boxes--be-in-touch"
                        style={{
                          display:
                            item.status === 'completed' ? 'none' : 'block',
                        }}
                      >
                        {item.be_in_touch ? (
                          <summary className="no-action">
                            The driver will to be in touch with you. So please
                            be sure to check your contact details.
                          </summary>
                        ) : (
                          <>
                            <summary> Creator's detail: </summary>
                            <p>
                              Full name:{' '}
                              <span>{item.created_by.full_name}</span>
                            </p>
                            <p>
                              Email: <span>{item.created_by.email}</span>
                            </p>
                            <p>
                              Phone: <span>{item.created_by.phone}</span>
                            </p>
                          </>
                        )}
                      </details>
                      <details
                        className="history__item__boxes "
                        style={{
                          display:
                            item.status === 'completed' ? 'none' : 'block',
                        }}
                      >
                        <summary className="no-action">
                          Companions {item.companions.length}
                        </summary>
                        {item.companions &&
                          item.created_by._id === user._id && (
                            <>
                              {item.companions.map((companion) => (
                                <p key={companion._id}>
                                  {companion.full_name} - {companion.email} -{' '}
                                  {companion.phone}
                                </p>
                              ))}
                            </>
                          )}
                      </details>
                      <article className="history__item__boxes">
                        From: <span>{item?.from}</span>
                      </article>
                      <article className="history__item__boxes">
                        To: <span>{item?.to}</span>
                      </article>
                      <article className="history__item__boxes">
                        Start: <span>{item?.start_date}</span>
                      </article>
                      <article className="history__item__boxes">
                        End: <span>{item?.end_date}</span>
                      </article>

                      {(item as DeliveryOrderDocument).weight && (
                        <article className="history__item__boxes">
                          Weight:{' '}
                          <span>
                            {formatWeight(
                              (item as DeliveryOrderDocument).weight
                            )}
                          </span>
                        </article>
                      )}
                      {(item as DeliveryOrderDocument).type_of_commodity && (
                        <article className="history__item__boxes">
                          Type Of Commodity:{' '}
                          <span>
                            {(
                              item as DeliveryOrderDocument
                            )?.type_of_commodity?.toUpperCase()}{' '}
                          </span>
                        </article>
                      )}

                      {(item as DeliveryOrderDocument).size && (
                        <article className="history__item__boxes">
                          Size:{' '}
                          <span>
                            {(item as DeliveryOrderDocument)?.size ?? ''}{' '}
                            (length - width - height){' '}
                          </span>
                        </article>
                      )}
                      {(item as JourneyDocument).seats && (
                        <article className="history__item__boxes">
                          Seats: <span>{(item as JourneyDocument).seats}</span>
                        </article>
                      )}

                      <article className="history__item__boxes">
                        Price: <span>{formatToSwedenCurrency(item.price)}</span>
                      </article>
                      <article className="history__item__boxes history__item__boxes--message">
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
                        <article className="history__item__boxes history__item__boxes--created-at ">
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
