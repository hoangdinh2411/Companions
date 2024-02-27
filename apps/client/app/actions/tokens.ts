'use server';

import { cookies } from 'next/headers';

export async function saveToken(token: string) {
  cookies().set({
    name: 'token',
    value: token,
    httpOnly: true,
    path: '/',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });
}
export async function getToken() {
  const token = cookies().get('token');
  if (!token) return '';
  return token.value;
}

export async function removeToken() {
  cookies().delete('token');
}
