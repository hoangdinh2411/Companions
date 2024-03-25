'use client';
import { DeliveryOrderDocument, JourneyDocument } from '@repo/shared';
import React from 'react';
import { useSocketContext } from '../../../lib/provider/SocketContextProvider';
import { useAppContext } from '../../../lib/provider/AppContextProvider';
import Button from '../../UI/Button';

type Props<T> = {
  ride: T;
};

export default function Creator<
  T extends DeliveryOrderDocument | JourneyDocument,
>({ ride }: Props<T>) {
  const { socketClient } = useSocketContext();
  const { user } = useAppContext();
  const handleBeginAChatting = () => {
    if (socketClient) {
      socketClient.emit('create-room', {
        invitee: ride?.created_by?._id,
      });
    }
  };
  if (ride.created_by._id === user._id) {
    return (
      <section className="ride__creator cards">
        <p className="ride__creator__be-in-touch">
          You are the creator of this ride
        </p>
      </section>
    );
  }
  if (!user._id) {
    return (
      <section className="ride__creator cards">
        <p>Please login to chat the driver</p>
      </section>
    );
  }

  if (
    ride?.companions?.findIndex((companion) => companion._id === user._id) ===
    -1
  ) {
    return (
      <section className="ride__creator cards">
        <p className="ride__creator__be-in-touch">
          You are not a companion of this ride. So you can't chat with the
          driver
        </p>
      </section>
    );
  }

  return (
    <section className="ride__creator cards">
      <Button variant="green" onClick={handleBeginAChatting}>
        Chat with the driver
      </Button>
    </section>
  );
}
