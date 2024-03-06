'use client';
import React, { useMemo, useState, useTransition } from 'react';
import appStore from '../../../../../lib/store/appStore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Button from '../../../../../components/UI/Button';
import Modal from '../../../../../components/UI/Modal';
import BankIDForm from '../../../../../components/shared/Modals/BankIDForm';
import APP_ROUTER from '../../../../../lib/config/router';
import { joinJourney } from '../../../../../actions/journeyApi';
import { JourneyDocument } from '@repo/shared';

type Props = {
  journey: JourneyDocument;
};

export default function Action({ journey }: Props) {
  const { user } = appStore.getState();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleJoinInJourney = async () => {
    if (!user._id) {
      router.push(APP_ROUTER.SIGN_IN);
      toast.warning('You need to sign in to join the journey!');
    }
    // const id_number = await getIdentifyNumber();
    // if (!id_number) {
    //   setOpen(true);
    //   return;
    // }
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

  const handleCloseModal = () => {
    setOpen(false);
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
        <>
          <Button
            variant='green'
            size='small'
            loading={isPending}
            onClick={handleJoinInJourney}
            disabled={hasJoined}
          >
            {hasJoined ? 'Has Joined' : 'Join'}
          </Button>
          <Modal open={open} onClose={handleCloseModal} disableClose>
            <BankIDForm closeModal={handleCloseModal} />
          </Modal>
        </>
      ) : (
        <h6 className='details__mark'>Your Journey</h6>
      )}
    </>
  );
}
