'use client';
import React, { useMemo, useTransition } from 'react';

import { useRouter } from 'next/navigation';
import { DeliveryOrderDocument, JourneyDocument } from '@repo/shared';
import { toast } from 'react-toastify';
import { useAppContext } from '../../../lib/provider/AppContextProvider';
import APP_ROUTER from '../../../lib/config/router';
import { getIdentifyNumber } from '../../../actions/tokens';
import Button from '../../UI/Button';

type Props<T> = {
  ride: T;
  handleBecomeCompanion: (ride_id: string, ride_slug: string) => Promise<any>;
};

export default function Action<
  T extends DeliveryOrderDocument | JourneyDocument,
>({ ride, handleBecomeCompanion }: Props<T>) {
  const { user } = useAppContext();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleTakeOrder = async () => {
    if (!user._id) {
      router.push(APP_ROUTER.SIGN_IN);
      toast.warning('You need to sign in!');
      return;
    }
    const id_number = await getIdentifyNumber();
    if (!id_number) {
      router.push(APP_ROUTER.IDENTIFY);
      return;
    }
    startTransition(async () => {
      const res = await handleBecomeCompanion(ride._id, ride.slug);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success('You are now companion of this ride!');
      router.refresh();
    });
  };

  const hasJoined = useMemo(() => {
    if (user._id && ride._id) {
      return ride?.companions.findIndex((r) => r._id === user._id) !== -1;
    }
    return false;
  }, [ride, user]);

  const isDriver = useMemo(() => {
    if (user && ride._id) {
      return user?._id === ride?.created_by?._id;
    }
    return false;
  }, [ride, user]);

  return (
    <>
      {!isDriver ? (
        <Button
          variant="green"
          size="small"
          loading={isPending}
          onClick={handleTakeOrder}
          disabled={hasJoined}
        >
          {hasJoined ? 'You have joined' : 'Join Now'}
        </Button>
      ) : (
        <span className="ride__details__mark">Your ride</span>
      )}
    </>
  );
}
