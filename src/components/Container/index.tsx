import { Container as MantineContainer } from '@mantine/core';
import { PropsWithChildren } from 'react';

export function Container({ children }: PropsWithChildren) {
  return <MantineContainer maw={500}>{children}</MantineContainer>;
}
