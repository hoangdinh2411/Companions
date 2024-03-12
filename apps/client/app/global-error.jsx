'use client';
import { useEffect } from 'react';
import Button from './components/UI/Button';
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className='error-page'>
        <p>Something went wrong!</p>
        <Button onClick={() => reset()}>Try again</Button>
      </body>
    </html>
  );
}
