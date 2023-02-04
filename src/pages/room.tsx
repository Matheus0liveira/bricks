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
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { createClientRoomCookie } from '@/utils';
import { useRouter } from 'next/router';
import { useSocket } from '@/hooks/useSocket';
import { SOCKET_EVENTS } from '@/types/socketEvents';
import { useSession } from 'next-auth/react';

export default function Room() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const textInputRef = useRef<HTMLInputElement>(null);

  const { socket } = useSocket();
  const session = useSession();

  useEffect(() => {
    if (!textInputRef.current) return;

    textInputRef.current.focus();
  }, []);

  const handleSubmit = useCallback(
    (ev: FormEvent) => {
      ev.preventDefault();

      try {
        if (!session.data?.user) throw Error('Session not found');

        if (!textInputRef.current) return;

        const value = textInputRef.current?.value;

        if (!value) return textInputRef.current.focus();

        if (!UUID_REGEX.test(value)) throw new Error('Code not valid');

        createClientRoomCookie({ value });

        socket?.emit(SOCKET_EVENTS.ENTER_ROOM, {
          playerId: session.data.user.id,
          keyRoom: value,
        });

        setErrorMessage('');
        router.push('/');
      } catch (e) {
        if (e instanceof Error) setErrorMessage(e.message);
      }
    },
    [router, session.data?.user, socket]
  );

  const handleCreateNewRoom = useCallback(() => {
    createClientRoomCookie({ isNewCookie: true });
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
