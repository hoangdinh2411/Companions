'use client';
import { JourneyDocument } from '@repo/shared';
import React, { useState } from 'react';
import Button from '../../../../../components/UI/Button';
import { getIdentifyNumber, getToken } from '../../../../../actions/tokens';
import Modal from '../../../../../components/UI/Modal';
import BankIDForm from '../../../../../components/shared/Modals/BankIDForm';
import APP_ROUTER from '../../../../../lib/config/router';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type Props = {
  data: JourneyDocument;
};

export default function Details({ data }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [idNumber, setIdNumber] = useState('');
  const handleJoinInJourney = async () => {
    const isSignedIn = await getToken();
    if (!isSignedIn) {
      router.push(APP_ROUTER.SIGN_IN);
      toast.warning('You need to sign in to join the journey!');
    }
    const id_number = await getIdentifyNumber();
    if (!id_number) {
      setOpen(true);
      return;
    }
  };

  const handleSignInByBankId = (idNumber: string) => {
    setIdNumber(idNumber);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };
  return (
    <>
      <section className='details cards'>
        <h4 className='details__title'>
          {' '}
          {data?.title}{' '}
          <Button variant='green' size='small' onClick={handleJoinInJourney}>
            Join
          </Button>
        </h4>
        <article className='details__boxes'>
          Travel Route:{' '}
          <span>
            {data?.from} &#8614; {data?.to}
          </span>
        </article>
        <article className='details__boxes'>
          Start: <span>{data?.start_date}</span>
        </article>
        <article className='details__boxes'>
          End: <span>{data?.end_date}</span>
        </article>
        <article className='details__boxes'>
          Time: <span>{data?.time}</span>
        </article>
        <article className='details__boxes'>
          Seats: <span>{data?.seats}</span>
        </article>
        <article className='details__boxes'>
          Price:{' '}
          <span>{data?.price === 0 ? 'Free' : data?.price + ' SEK'} </span>
        </article>
        <article className='details__boxes details__boxes--message'>
          Message:{' '}
          <div>
            {!data?.message ? (
              "(don't have any message for this journey yet!)"
            ) : (
              <blockquote>
                <p>{data?.message} </p>
              </blockquote>
            )}
          </div>
        </article>
      </section>
      <Modal open={open} onClose={handleCloseModal}>
        <BankIDForm
          handleSignInByBankId={handleSignInByBankId}
          closeModal={handleCloseModal}
        />
      </Modal>
    </>
  );
}
