import { Text, Paper, Group, Container } from '@mantine/core';
import { GoogleButton } from '@/components/SocialButtons/GoogleButton';
import { GithubButton } from '@/components/SocialButtons/GithubButton';
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { BuiltInProviderType } from 'next-auth/providers';
import { memo } from 'react';
import { getServerSideGuest } from '@/hocs/withGuest';

type AuthPageProps = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
};

export default function Auth({ providers }: AuthPageProps) {
  return (
    <Container maw={450} mt={120}>
      <Paper radius='md' p='xl' withBorder>
        <Text size='lg' weight={500}>
          Welcome, login with
        </Text>

        <Group grow mb='md' mt='md'>
          {providers
            ? Object.values(providers).map(({ id, name }) => (
                <ProviderButton
                  key={id}
                  name={name}
                  onClick={() => signIn(id)}
                />
              ))
            : null}
        </Group>
      </Paper>
    </Container>
  );
}

type ProviderButtonProps = {
  name: string;
  onClick(): void;
};
const ProviderButton = memo(({ name, onClick }: ProviderButtonProps) => {
  return name !== 'Credentials' ? (
    name === 'Google' ? (
      <GoogleButton radius='xl' onClick={onClick}>
        {name}
      </GoogleButton>
    ) : (
      <GithubButton radius='xl' onClick={onClick}>
        {name}
      </GithubButton>
    )
  ) : null;
});

export const getServerSideProps: GetServerSideProps = getServerSideGuest(
  async () => {
    const providers = await getProviders();
    return {
      props: { providers },
    };
  }
);
