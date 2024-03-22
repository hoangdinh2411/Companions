'use client';
import { JourneyDocument } from '@repo/shared';
import { useAppContext } from '../../../../lib/provider/AppContextProvider';

type Props = {
  journey: JourneyDocument;
};

export default function Creator({ journey }: Props) {
  const { user } = useAppContext();

  if (!user._id) {
    return (
      <section className="creator cards">
        <article>Please join to see the creator's details.</article>
      </section>
    );
  }
  return (
    <section className="creator cards">
      <h5 className="creator__header">Created By</h5>
      {journey?.be_in_touch ? (
        <p className="creator__be-in-touch">
          The driver will to be in touch with you. So please be sure to check
          your contact details.
        </p>
      ) : (
        <p className="creator__be-in-touch">
          Go to your history to see the creator's details.
        </p>
      )}
    </section>
  );
}
