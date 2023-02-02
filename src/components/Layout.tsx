import { memo, PropsWithChildren } from 'react';
import { Head } from './Head';
import { Header } from './Header';

function LayoutComponent({ children }: PropsWithChildren) {
  return (
    <>
      <Head />
      <Header />
      {children}
    </>
  );
}

export const Layout = memo(LayoutComponent);
