'use client';
import React, { useMemo, useTransition } from 'react';

import { useRouter } from 'next/navigation';
import { DeliveryOrderDocument } from '@repo/shared';
import { takeOrder } from '../../../../actions/deliveryOrderApi';
import { toast } from 'react-toastify';
import Button from '../../../../components/UI/Button';
import APP_ROUTER from '../../../../lib/config/router';
import { getIdentifyNumber } from '../../../../actions/tokens';
import { useAppContext } from '../../../../lib/provider/AppContextProvider';

type Props = {
  order: DeliveryOrderDocument;
};

export default function Action({ order }: Props) {
  const { user } = useAppContext();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleTakeOrder = async () => {
    if (!user._id) {
      router.push(APP_ROUTER.SIGN_IN);
      toast.warning('You need to sign in to take the order!');
      return;
    }
    const id_number = await getIdentifyNumber();
    if (!id_number) {
      router.push(APP_ROUTER.IDENTIFY);
      return;
    }
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
        <Button
          variant="green"
          size="small"
          loading={isPending}
          onClick={handleTakeOrder}
          disabled={hasTaken}
        >
          {hasTaken ? 'Has Taken' : 'Take Order'}
        </Button>
      ) : (
        <h6 className="details__mark">Your Order</h6>
      )}
    </>
  );
}
