'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import QRCode from 'react-qr-code';
import Image from 'next/image';
import { saveIdentifyNumber } from '../../actions/tokens';
import Button from '../../components/UI/Button';
import TextField from '../../components/UI/TextField';
import LoadingSpinner from '../../components/UI/Loading';
import { useRouter } from 'next/navigation';
import './Identify.scss';

export default function IdentifyPage() {
  const [idNumber, setIdNumber] = useState('');
  const [randomToken, setRandomToken] = useState('');
  const inputRef = React.createRef<HTMLInputElement>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handelVerify = () => {
    const value = inputRef.current ? inputRef.current.value : '';
    if (!value) {
      toast.error('Please enter your ID number');
      return;
    }
    setIdNumber(value);
  };

  function closeModal() {
    router.back();
  }
  useEffect(() => {
    if (idNumber === '') return;
    // just a demo to show the loading spinner, in real world we will use the bankId api to verify the user
    const renewQrCode = setInterval(() => {
      setRandomToken(Math.random().toString(36).substring(7));
    }, 1000);
    // timeout to end the session if the user didn't verify the identity within 30 seconds
    const timeout = setTimeout(() => {
      setIdNumber('');
      clearInterval(renewQrCode);
      closeModal();
    }, 30000);

    const showLoading = setTimeout(() => {
      clearInterval(renewQrCode);
      setLoading(true);
      setTimeout(async () => {
        await saveIdentifyNumber(idNumber);
        setLoading(false);
        clearTimeout(timeout);
        closeModal();
      }, 2000);
    }, 2000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(showLoading);
      clearInterval(renewQrCode);
    };
  }, [idNumber]);

  if (loading) {
    return (
      <div className='identify-bank-id__container'>
        <h1>Successfully identify with bankId</h1>
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <div className='identify-bank-id__container'>
      {idNumber !== '' ? (
        <div className='qr-code'>
          <Image
            src='/BankID_logo.png'
            alt='Bank ID Logo'
            width={120}
            height={120}
          />
          <QRCode
            bgColor='#ffffff'
            fgColor='#000000'
            value={`bankid.${randomToken}].0.`}
            className='qr-code__content'
          />
          <ol className='qr-code__steps'>
            <li>Open the BankID app on your smart phone.</li>
            <li>Tap the QR icon in the app.</li>
            <li>Point the camera at the QR code.</li>
            <li>Follow the instructions in the app.</li>
          </ol>
          <Button type='button' onClick={closeModal}>
            Cancel
          </Button>
        </div>
      ) : (
        <div>
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
          <form className='bankid-form'>
            <TextField
              label='ID Number'
              placeholder='YYYYMMDD-NNNN'
              name='id_number'
              ref={inputRef}
              type='tel'
              pattern='[0-9]{8}-[0-9]{4}'
              required
            />
            <div className='bankid-form__btns'>
              <Button type='button' variant='white' onClick={closeModal}>
                Cancel
              </Button>
              <Button type='button' onClick={handelVerify}>
                Identify with BankID
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
