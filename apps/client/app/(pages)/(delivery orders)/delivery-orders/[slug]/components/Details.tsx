'use client';
import { DeliverOrderDocument } from '@repo/shared';
import React, { useState } from 'react';
import Button from '../../../../../components/UI/Button';
import { getIdentifyNumber } from '../../../../../actions/tokens';
import Modal from '../../../../../components/UI/Modal';
import BankIDForm from '../../../../../components/shared/Modals/BankIDForm';

type Props = {
  data: DeliverOrderDocument;
};

export default function Details({ data }: Props) {
  const [open, setOpen] = useState(false);
  const [idNumber, setIdNumber] = useState('');
  const handleTakeOrder = async () => {
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
          <Button variant='green' size='small' onClick={handleTakeOrder}>
            Take order
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
          Weight: <span>{data?.weight}</span>
        </article>
        <article className='details__boxes'>
          Type Of Commodity: <span>{data?.type_of_commodity} </span>
        </article>
        {data?.size ? (
          <article className='details__boxes'>
            Size: <span>{data?.size ?? ''} </span>
          </article>
        ) : null}
        <article className='details__boxes'>
          Price:{' '}
          <span>{data?.price === 0 ? 'Free' : data?.price + ' SEK'} </span>
        </article>
        <article className='details__boxes details__boxes--message'>
          Note:{' '}
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
