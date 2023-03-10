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
import { SOCKET_EVENTS } from '@/types/socketEvents';
import { useSession } from 'next-auth/react';
import { GameService } from '@/services/game.service';
import { useLoading } from '@/stores/loading';
import { useSocketStore } from '@/stores/socket.store';

export default function Room() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const textInputRef = useRef<HTMLInputElement>(null);
  const showLoading = useLoading((state) => state.showLoading);
  const hideLoading = useLoading((state) => state.hideLoading);

  const { changeRoomByPlayerId } = new GameService();

  const socket = useSocketStore((state) => state.socket);
  const session = useSession();

  useEffect(() => {
    if (!textInputRef.current) return;

    textInputRef.current.focus();
  }, []);

  const handleEmitPlayerEnterRoom = useCallback(
    (playerId: string, keyRoom: string) => {
      socket?.emit(SOCKET_EVENTS.ENTER_ROOM, { playerId, keyRoom });
    },
    [socket]
  );

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

        handleEmitPlayerEnterRoom(session.data.user.id, keyRoom);
        setErrorMessage('');

        router.push('/');
      } catch (e) {
        if (e instanceof Error) setErrorMessage(e.message);
      } finally {
        hideLoading();
      }
    },
    [
      showLoading,
      session.data?.user,
      changeRoomByPlayerId,
      handleEmitPlayerEnterRoom,
      router,
      hideLoading,
    ]
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
      handleEmitPlayerEnterRoom(session.data.user.id, room.id);
      router.push('/');
    } catch (e) {
      if (e instanceof Error) setErrorMessage(e.message);
    } finally {
      hideLoading();
    }
  }, [
    changeRoomByPlayerId,
    handleEmitPlayerEnterRoom,
    hideLoading,
    router,
    session.data,
    showLoading,
  ]);

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
