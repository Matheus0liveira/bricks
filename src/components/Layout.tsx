import { memo, PropsWithChildren } from 'react';
import { Head } from './Head';
import { Header } from './Header';

const data = {
  user: {
    name: 'Jane Spoonfighter',
    email: 'janspoon@fighter.dev',
    image:
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
  },
};

function LayoutComponent({ children }: PropsWithChildren) {
  return (
    <>
      <Head />
      <Header {...data} />
      {children}
    </>
  );
}

export const Layout = memo(LayoutComponent);