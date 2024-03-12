'use client';
import { redirect } from 'next/navigation';
import APP_ROUTER from './lib/config/router';

export default function NotFound() {
  redirect(APP_ROUTER.HOME);
}
