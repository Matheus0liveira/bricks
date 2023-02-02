import { Text, Paper, Container, Alert, Flex } from '@mantine/core';
import { GoogleButton } from '@/components/SocialButtons/GoogleButton';
import { GithubButton } from '@/components/SocialButtons/GithubButton';
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
} from 'next-auth/react';
import { useRouter } from 'next/router';
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
  const router = useRouter();

  return (
    <Container maw={450} mt={120}>
      {router.query?.error ? (
        <Alert title='Error' variant='outline' color='yellow' mb={16}>
          {router.query.error}
        </Alert>
      ) : null}
      <Paper radius='md' p='xl' withBorder>
        <Text size='lg' weight={500}>
          Welcome, login with
        </Text>

        <Flex mb='md' mt='md' direction='column' rowGap='md'>
          {providers
            ? Object.values(providers).map(({ id, name }) => (
                <ProviderButton
                  key={id}
                  name={name}
                  onClick={() => signIn(id)}
                />
              ))
            : null}
        </Flex>
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
