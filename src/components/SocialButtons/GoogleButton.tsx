import { Button, ButtonProps } from '@mantine/core';
import { GoogleIcon } from './icons/GoogleIcon';

type GoogleButtonProps = {
  onClick(): void;
} & ButtonProps;

export function GoogleButton(props: GoogleButtonProps) {
  return (
    <Button
      leftIcon={<GoogleIcon />}
      variant='default'
      color='gray'
      {...props}
    />
  );
}
