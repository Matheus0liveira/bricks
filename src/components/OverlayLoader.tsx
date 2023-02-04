import { LoadingOverlay } from '@mantine/core';
import { useLoading } from '@/stores/loading';
import Router from 'next/router';

export function OverlayLoader() {
  const isLoading = useLoading((store) => store.isLoading);
  const showLoading = useLoading((store) => store.showLoading);
  const hideLoading = useLoading((store) => store.hideLoading);

  Router.events.on('routeChangeStart', () => showLoading());
  Router.events.on('routeChangeComplete', () => hideLoading());
  Router.events.on('routeChangeError', () => hideLoading());

  return (
    <LoadingOverlay
      visible={isLoading > 0}
      overlayBlur={3}
      overlayColor={'false'}
    />
  );
}
