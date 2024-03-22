'use client';
import { DeliveryOrderDocument } from '@repo/shared';
import React from 'react';
import { useSocketContext } from '../../../../lib/provider/SocketContextProvider';
import { useAppContext } from '../../../../lib/provider/AppContextProvider';
import Button from '../../../../components/UI/Button';

type Props = {
  order: DeliveryOrderDocument;
};

export default function Creator({ order }: Props) {
  const { socketConnection } = useSocketContext();
  const { user } = useAppContext();
  const handleCreateRoom = () => {
    if (socketConnection) {
      socketConnection.emit('create-room', {
        inviter: user?._id,
        invitee: order?.created_by?._id,
      });
    }
  };

  if (!user._id) {
    return (
      <section className="creator cards">
        <article>Please login to contact the creator</article>
      </section>
    );
  }

  if (
    order?.companions?.findIndex((companion) => companion._id === user._id) ===
    -1
  ) {
    return (
      <section className="creator cards">
        <p className="creator__be-in-touch">
          You are not a companion of this order. So you can't contact the
          creator
        </p>
      </section>
    );
  }
  return (
    <section className="creator cards">
      {order?.be_in_touch ? (
        <p className="creator__be-in-touch">
          The driver will to be in touch with you. So please taking the order
          and be correct your contact details.
        </p>
      ) : (
        <Button variant="green" onClick={handleCreateRoom}>
          Send Message
        </Button>
      )}
    </section>
  );
}
