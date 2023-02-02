import { COOKIES } from '@/shared/cookies';
import { GetServerSidePropsContext } from 'next';
import { setCookie, destroyCookie, parseCookies } from 'nookies';

export const TOTAL_COLS = 9;
export const TOTAL_ROWS = 9;

export const bricksArray = Array.from({ length: TOTAL_COLS * TOTAL_ROWS }).map(
  (_, i) => i
);

export const getServerCookie = (
  ctx: GetServerSidePropsContext,
  name: COOKIES
): string | null => {
  const cookie = ctx.req.cookies[name];

  return cookie ?? null;
};

export const clientCreateNewCookie = (name: string, value: string) => {
  setCookie(null, name, value, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });
};

const ROOM_KEY_NAME = 'room-key';

type CreateRoomCookie = {
  isNewCookie?: boolean;
  value?: string;
};
export const createClientRoomCookie = ({
  value,
  isNewCookie = false,
}: CreateRoomCookie) => {
  if (!value && !isNewCookie)
    throw Error('[CreateRoomCookie] Value is required');

  return clientCreateNewCookie(
    ROOM_KEY_NAME,
    isNewCookie ? crypto.randomUUID() : value ?? ''
  );
};
export const deleteClientRoomCookie = () => {
  return destroyCookie(null, ROOM_KEY_NAME);
};
export const getClientRoomCookie = () => {
  return parseCookies()[ROOM_KEY_NAME];
};
