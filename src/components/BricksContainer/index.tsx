import { Flex as MantineFlex, Container } from '@mantine/core';
import { forwardRef, PropsWithChildren } from 'react';

export const BricksContainer = forwardRef<HTMLDivElement, PropsWithChildren>(
  ({ children }, ref) => {
    return (
      <Container maw={500}>
        <MantineFlex
          ref={ref}
          mih={50}
          gap={5}
          justify='flex-start'
          align='flex-start'
          direction='row'
          wrap='wrap'
        >
          {children}
        </MantineFlex>
      </Container>
    );
  }
);
