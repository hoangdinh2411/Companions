'use client';
import { JourneyDocument } from '@repo/shared';
import React, { useState } from 'react';
import Button from '../../../../../components/UI/Button';
import { getIdentifyNumber } from '../../../../../actions/tokens';
import Modal from '../../../../../components/UI/Modal';
import BankIDForm from '../../../../../components/shared/Modals/BankIDForm';

type Props = {
  data: JourneyDocument;
};

export default function Details({ data }: Props) {
  const [open, setOpen] = useState(false);
  const [idNumber, setIdNumber] = useState('');
  const handleJoinInJourney = async () => {
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
        <article className='details__distance'>
          Travel Route:{' '}
          <span>
            {data?.from} &#8614; {data?.to}
          </span>
        </article>
        <article className='details__date'>
          Start: <span>{data?.startDate}</span>
        </article>
        <article className='details__date'>
          End: <span>{data?.endDate}</span>
        </article>
        <article className='details__seats'>
          Seats: <span>{data?.seats}</span>
        </article>
        <article className='details__price'>
          Price:{' '}
          <span>{data?.price === 0 ? 'Free' : data?.price + ' SEK'} </span>
        </article>
        <article className='details__message'>
          Note:{' '}
          {!data?.message ? (
            "(don't have any message for this journey yet!)"
          ) : (
            <blockquote>
              <p>{data?.message} </p>
            </blockquote>
          )}
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
