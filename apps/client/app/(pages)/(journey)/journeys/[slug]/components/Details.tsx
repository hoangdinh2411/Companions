'use client';
import { JourneyDocument } from '@repo/shared';
import React, { useMemo, useState, useTransition } from 'react';
import Button from '../../../../../components/UI/Button';
import { getIdentifyNumber, getToken } from '../../../../../actions/tokens';
import Modal from '../../../../../components/UI/Modal';
import BankIDForm from '../../../../../components/shared/Modals/BankIDForm';
import APP_ROUTER from '../../../../../lib/config/router';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { joinJourney } from '../../../../../actions/journeyApi';
import appStore from '../../../../../lib/store/appStore';

type Props = {
  journey: JourneyDocument;
};

export default function Details({ journey }: Props) {
  const router = useRouter();
  const user = appStore((state) => state.user);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const handleJoinInJourney = async () => {
    if (!user._id) {
      router.push(APP_ROUTER.SIGN_IN);
      toast.warning('You need to sign in to join the journey!');
    }
    const id_number = await getIdentifyNumber();
    if (!id_number) {
      setOpen(true);
      return;
    }
    startTransition(async () => {
      const res = await joinJourney(journey._id, journey.slug);
      if (res.success) {
        toast.success('You have joined the journey successfully!');
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const hasJoined = useMemo(() => {
    if (user && journey._id) {
      return user?.journeys_joined?.includes(journey?._id);
    }
    return false;
  }, [journey, user]);

  const isYourJourney = useMemo(() => {
    if (user && journey._id) {
      return user?._id === journey?.created_by?._id;
    }
    return false;
  }, [journey, user]);
  return (
    <>
      <section className='details cards'>
        <h4 className='details__title'>
          {' '}
          {journey?.title}
          {!isYourJourney ? (
            <Button
              variant='green'
              size='small'
              loading={isPending}
              onClick={handleJoinInJourney}
              disabled={hasJoined}
            >
              {hasJoined ? 'Joined' : 'Join'}
            </Button>
          ) : (
            <h6 className='details__mark'>Your Journey</h6>
          )}
        </h4>
        <article className='details__boxes'>
          From: <span>{journey?.from}</span>
        </article>
        <article className='details__boxes'>
          To: <span>{journey?.to}</span>
        </article>
        <article className='details__boxes'>
          Start: <span>{journey?.start_date}</span>
        </article>
        <article className='details__boxes'>
          End: <span>{journey?.end_date}</span>
        </article>
        <article className='details__boxes'>
          Time: <span>{journey?.time}</span>
        </article>
        <article className='details__boxes'>
          Seats: <span>{journey?.seats}</span>
        </article>
        <article className='details__boxes'>
          Price:{' '}
          <span>
            {journey?.price === 0 ? 'Free' : journey?.price + ' SEK'}{' '}
          </span>
        </article>
        <article className='details__boxes'>
          Total Joiner:{' '}
          <span>
            {journey?.companions?.length > 0 ? journey?.companions?.length : 0}
          </span>
        </article>
        <article className='details__boxes details__boxes--message'>
          Message:{' '}
          <div>
            {!journey?.message ? (
              "(don't have any message for this journey yet!)"
            ) : (
              <blockquote>
                <p>{journey?.message} </p>
              </blockquote>
            )}
          </div>
        </article>
      </section>
      <Modal open={open} onClose={handleCloseModal} disableClose>
        <BankIDForm closeModal={handleCloseModal} />
      </Modal>
    </>
  );
}
