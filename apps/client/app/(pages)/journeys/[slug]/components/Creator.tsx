import { JourneyDocument } from '@repo/shared';

type Props = {
  journey: JourneyDocument;
};

export default function Creator({ journey }: Props) {
  return (
    <section className='creator cards'>
      <h5 className='creator__header'>Created By</h5>
      {journey?.be_in_touch ? (
        <p className='creator__be-in-touch'>
          The driver will to be in touch with you. So please be sure to check
          your contact details.
        </p>
      ) : (
        <>
          <article className='creator__phone'>
            Name: <span>{journey?.created_by?.full_name}</span>
          </article>
          <article className='creator__email'>
            Email: <span>{journey?.created_by?.email}</span>
          </article>
          <article className='creator__phone'>
            Phone: <span>{journey?.created_by?.phone}</span>
          </article>
        </>
      )}
    </section>
  );
}
