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
import { GameService } from '@/services/game.service';
import { useLoading } from '@/stores/loading';

export default function Room() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const textInputRef = useRef<HTMLInputElement>(null);
  const showLoading = useLoading((state) => state.showLoading);
  const hideLoading = useLoading((state) => state.hideLoading);

  const { changeRoomByPlayerId } = new GameService();

  const { socket } = useSocket();
  const session = useSession();

  useEffect(() => {
    if (!textInputRef.current) return;

    textInputRef.current.focus();
  }, []);

  const handleSubmit = useCallback(
    async (ev: FormEvent) => {
      showLoading();
      ev.preventDefault();

      try {
        if (!session.data?.user) throw Error('Session not found');

        if (!textInputRef.current) return;

        const keyRoom = textInputRef.current?.value;

        if (!keyRoom) return textInputRef.current.focus();

        if (!UUID_REGEX.test(keyRoom)) throw new Error('Code not valid');

        createClientRoomCookie({ value: keyRoom });

        await changeRoomByPlayerId({ playerId: session.data.user.id, keyRoom });

        // socket?.emit(SOCKET_EVENTS.ENTER_ROOM, {
        //   playerId: session.data.user.id,
        //   keyRoom: value,
        // });

        setErrorMessage('');
        hideLoading();
        router.push('/');
      } catch (e) {
        if (e instanceof Error) setErrorMessage(e.message);
      } finally {
      }
    },
    [changeRoomByPlayerId, hideLoading, session.data?.user, showLoading, router]
  );

  const handleCreateNewRoom = useCallback(async () => {
    try {
      showLoading();
      setErrorMessage('');
      if (!session.data) return;

      const { room } = await changeRoomByPlayerId({
        playerId: session.data.user.id,
        isOwner: true,
      });
      createClientRoomCookie({ value: room.id });
      hideLoading();
      router.push('/');
    } catch (e) {
      if (e instanceof Error) setErrorMessage(e.message);
    } finally {
    }
  }, [changeRoomByPlayerId, hideLoading, router, session.data, showLoading]);

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
