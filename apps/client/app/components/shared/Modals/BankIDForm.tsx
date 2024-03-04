import React from 'react';
import TextField from '../../UI/TextField';
import Button from '../../UI/Button';
import { toast } from 'react-toastify';

type Props = {
  loading?: boolean;
  handleSignInByBankId: (id_number: string) => void;
  closeModal: () => void;
};

export default function BankIDForm({
  loading,
  closeModal,
  handleSignInByBankId,
}: Props) {
  const idNumberRef = React.createRef<HTMLInputElement>();
  const handelClick = () => {
    if (!idNumberRef.current) return;
    if (idNumberRef.current?.value === '') {
      toast.error('Please enter your ID number');
      return;
    }
    if (idNumberRef.current?.value) {
      handleSignInByBankId(idNumberRef.current?.value);
      toast.success('Logged in with BankID successfully');
      closeModal();
    }
  };
  return (
    <div className='identify-bank-id__container'>
      <h4>Bank Id</h4>
      <article>
        <strong>
          Note that identify with BankID is required to use the services. We
          need to verify your identity to ensure the safety of our users.
        </strong>
        <p>
          <small>
            <br />
            The BankID identification must be entered wih 12 digits :
            YYYYMMDD-NNNN
          </small>
        </p>
      </article>
      <form>
        <TextField
          label='ID Number'
          placeholder='YYYYMMDD-NNNN'
          name='id_number'
          ref={idNumberRef}
          type='tel'
          pattern='[0-9]{8}-[0-9]{4}'
          required
        />
        <Button type='button' onClick={handelClick} loading={loading}>
          Identify with BankID
        </Button>
      </form>
    </div>
  );
}
