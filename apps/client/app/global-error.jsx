'use client';
import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="error-page">
        <p>Something went wrong!</p>
      </body>
    </html>
  );
}
