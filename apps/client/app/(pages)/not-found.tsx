'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Button from '../components/UI/Button';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className='not-found-page'>
      <h1>Data not found</h1>
      <Button onClick={() => router.back()}>Go back to previous page</Button>
    </div>
  );
}
