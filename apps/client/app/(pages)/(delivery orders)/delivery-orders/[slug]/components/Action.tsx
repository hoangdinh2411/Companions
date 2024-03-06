'use client';
import React, { useMemo, useState, useTransition } from 'react';
import appStore from '../../../../../lib/store/appStore';
import { useRouter } from 'next/navigation';
import { DeliverOrderDocument } from '@repo/shared';
import { takeOrder } from '../../../../../actions/deliveryOrderApi';
import { toast } from 'react-toastify';
import Button from '../../../../../components/UI/Button';
import Modal from '../../../../../components/UI/Modal';
import BankIDForm from '../../../../../components/shared/Modals/BankIDForm';
import APP_ROUTER from '../../../../../lib/config/router';

type Props = {
  order: DeliverOrderDocument;
};

export default function Action({ order }: Props) {
  const { user } = appStore.getState();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleTakeOrder = () => {
    if (!user._id) {
      router.push(APP_ROUTER.SIGN_IN);
      toast.warning('You need to sign in to take the order!');
      return;
    }
    // const id_number = await getIdentifyNumber();
    // if (!id_number) {
    //   setOpen(true);
    //   return;
    // }
    startTransition(async () => {
      const res = await takeOrder(order._id, order.slug);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success('You have taken this order');
      router.refresh();
    });
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const hasTaken = useMemo(() => {
    if (user._id && order._id) {
      return order?.companions.findIndex((c) => c._id === user._id) !== -1;
    }
    return false;
  }, [order, user]);

  const isYourOrder = useMemo(() => {
    if (user && order._id) {
      return user?._id === order?.created_by?._id;
    }
    return false;
  }, [order, user]);

  return (
    <>
      {!isYourOrder ? (
        <>
          <Button
            variant='green'
            size='small'
            loading={isPending}
            onClick={handleTakeOrder}
            disabled={hasTaken}
          >
            {hasTaken ? 'Has Taken' : 'Take Order'}
          </Button>
          <Modal open={open} onClose={handleCloseModal}>
            <BankIDForm closeModal={handleCloseModal} />
          </Modal>
        </>
      ) : (
        <h6 className='details__mark'>Your Order</h6>
      )}
    </>
  );
}