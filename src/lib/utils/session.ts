'use client';
import Cookies from 'js-cookie';

export type SessionParams = {
  refreshToken: string;
  expires?: number; // in days, default 7
};

export const setUserSession = ({
  refreshToken,
  expires = 7,
}: SessionParams) => {
  Cookies.set('refresh_token', refreshToken, {
    expires,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });
};

export const getUserSession = (): string => {
  const cookieValue = Cookies.get('refresh_token');

  return cookieValue ?? '';
};
