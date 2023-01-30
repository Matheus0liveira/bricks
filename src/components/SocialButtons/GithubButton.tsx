import { Button, ButtonProps } from '@mantine/core';
import { GithubIcon } from './icons/GithubIcon';

type GithubButtonProps = {
  onClick(): void;
} & ButtonProps;

export function GithubButton(props: GithubButtonProps) {
  return (
    <Button
      leftIcon={<GithubIcon />}
      variant='default'
      color='gray'
      {...props}
    />
  );
}
