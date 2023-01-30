import { LoadingOverlay } from '@mantine/core';
import { useLoading } from '@/stores/loading';

export function OverlayLoader() {
  const isLoading = useLoading((store) => store.isLoading);

  return (
    <LoadingOverlay
      visible={isLoading > 0}
      overlayBlur={3}
      overlayColor={'false'}
    />
  );
}
