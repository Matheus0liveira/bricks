import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { SessionProvider } from 'next-auth/react';
import '../styles/global.css';
import { OverlayLoader } from '@/components/OverlayLoader';
import { useSocketStore } from '@/stores/socket.store';
import { useEffect } from 'react';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const setSocket = useSocketStore((state) => state.setSocket);
  const socket = useSocketStore((state) => state.socket);

  useEffect(() => {
    setSocket();

    return () => {
      socket?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSocket]);

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
      </Head>
      <SessionProvider session={session}>
        <OverlayLoader />
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: 'dark',
          }}
        >
          <Component {...pageProps} />
        </MantineProvider>
      </SessionProvider>
    </>
  );
}
