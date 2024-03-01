'use client';
import { redirect } from 'next/navigation';

export default function NotFound() {
  return (
    <section>
      <h1>Data not found</h1>
      <Button>Go to home page</Button>
    </section>
  );
}
