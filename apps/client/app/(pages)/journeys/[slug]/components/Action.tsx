'use client';
import React, { useMemo, useTransition } from 'react';

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Button from '../../../../components/UI/Button';
import APP_ROUTER from '../../../../lib/config/router';
import { joinJourney } from '../../../../actions/journeyApi';
import { JourneyDocument } from '@repo/shared';
import { getIdentifyNumber } from '../../../../actions/tokens';
import { useAppContext } from '../../../../lib/provider/AppContextProvider';

type Props = {
  journey: JourneyDocument;
};

export default function Action({ journey }: Props) {
  const { user } = useAppContext();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleJoinInJourney = async () => {
    if (!user._id) {
      router.push(APP_ROUTER.SIGN_IN);
      toast.warning('You need to sign in to join the journey!');
      return;
    }
    const id_number = await getIdentifyNumber();
    if (!id_number) {
      router.push(APP_ROUTER.IDENTIFY);
      return;
    }
    startTransition(async () => {
      const res = await joinJourney(journey._id, journey.slug);
      if (res.success) {
        toast.success('You have joined the journey successfully!');
        router.refresh();
      } else {
        toast.error(res.message);
      }
    });
  };

  const hasJoined = useMemo(() => {
    if (user && journey._id) {
      return journey?.companions.findIndex((c) => c._id === user._id) !== -1;
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
      {!isYourJourney ? (
        <Button
          variant="green"
          size="small"
          loading={isPending}
          onClick={handleJoinInJourney}
          disabled={hasJoined}
        >
          {hasJoined ? 'Has Joined' : 'Join'}
        </Button>
      ) : (
        <h6 className="details__mark">Your Journey</h6>
      )}
    </>
  );
}
