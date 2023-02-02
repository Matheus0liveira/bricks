import { getServerSideSession } from '@/hocs/withSession';
import { UUID_REGEX } from '@/shared/regex';
import {
  Paper,
  Title,
  TextInput,
  Button,
  Container,
  Group,
} from '@mantine/core';
import { parseCookies, setCookie } from 'nookies';
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import crypto from 'crypto';
import { createRoomCookie } from '@/utils';
import { useRouter } from 'next/router';

export default function Room() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!textInputRef.current) return;

    textInputRef.current.focus();
  }, []);

  const handleSubmit = useCallback(
    (ev: FormEvent) => {
      ev.preventDefault();

      try {
        if (!textInputRef.current) return;

        const value = textInputRef.current?.value;

        if (!value) return textInputRef.current.focus();

        if (!UUID_REGEX.test(value)) throw new Error('Code not valid');

        createRoomCookie({ value });

        setErrorMessage('');
        router.push('/');
      } catch (e) {
        if (e instanceof Error) setErrorMessage(e.message);
      }
    },
    [router]
  );

  const handleCreateNewRoom = useCallback(() => {
    createRoomCookie({ isNewCookie: true });
    setErrorMessage('');
    router.push('/');
  }, [router]);

  return (
    <Container maw={450} mt={120}>
      <Title align='center'>Join the room or create a new one</Title>

      <Paper
        component='form'
        onSubmit={handleSubmit}
        withBorder
        shadow='md'
        p={30}
        radius='md'
        mt='xl'
      >
        <TextInput
          ref={textInputRef}
          label='Key Room'
          placeholder='12345678'
          error={errorMessage.length ? errorMessage : null}
        />
        <Group position='apart' mt='lg'>
          <Button variant='light' onClick={handleCreateNewRoom}>
            Create new room
          </Button>
          <Button type='submit' variant='gradient'>
            Enter the room
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}

export const getServerSideProps = getServerSideSession(async () => {
  return {
    props: {},
  };
});
