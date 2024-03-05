'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import APP_ROUTER from '../lib/config/router';

export async function saveToken(token: string) {
  cookies().set({
    name: 'sign-in',
    value: token,
    httpOnly: true,
    maxAge: 60 * 60 * 1,
    // secure: true,
    path: '/',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 1),
  });
}
export async function getToken() {
  const token = cookies().get('sign-in');
  if (!token || !token.value) return '';
  return token.value;
}

export async function removeToken() {
  cookies().delete('sign-in');
}

export async function saveIdentifyNumber(idNumber: string) {
  cookies().set({
    name: 'sign_in_id',
    value: idNumber,
    httpOnly: true,
    maxAge: 60 * 15,
    // secure: true,
    path: '/',
    expires: new Date(Date.now() + 1000 * 60 * 15),
  });
}

export async function getIdentifyNumber() {
  const idNumber = cookies().get('sign_in_id');
  if (!idNumber) return '';
  return idNumber.value;
}

export async function removeIdentifyNumber() {
  cookies().delete('sign_in_id');
}
