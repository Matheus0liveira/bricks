import { Button, ButtonProps } from '@mantine/core';
import { GithubIcon } from './icons/GithubIcon';

export function GithubButton(props: ButtonProps) {
  return (
    <Button
      leftIcon={<GithubIcon />}
      variant='default'
      color='gray'
      {...props}
    />
  );
}
