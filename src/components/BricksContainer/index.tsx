// import { useSocket } from '@/hooks/useSocket';
import { useSocketStore } from '@/stores/socket.store';
import { SOCKET_EVENTS } from '@/types/socketEvents';
import { bricksArray } from '@/utils';
import {
  Container,
  Skeleton,
  Grid,
  useMantineTheme,
  Stack,
  Paper,
} from '@mantine/core';
import { useSession } from 'next-auth/react';
import {
  PropsWithChildren,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

// const tree = [23, 24, 25, 26, 36, 46, 45, 44, 43, 56, 66, 65, 64, 63];
// const two = [23, 24, 25, 26, 36, 46, 45, 44, 43, 53, 63, 64, 65, 66];
// const one = [25, 35, 45, 55, 65];

type KeyVariables = 'ArrowUp' | 'ArrowRight' | 'ArrowDown' | 'ArrowLeft';

type CheckEvent = () => {
  isUpRow: boolean;
  isDownRow: boolean;
  isLeftColumn: boolean;
  isRightColumn: boolean;
};

type KeyFuncs = Record<KeyVariables, (c: CheckEvent) => void | false>;

type BricksContainerProps = {
  keyRoom: string;
  players: Player[];
} & PropsWithChildren;

type Player = {
  position?: { left: number; top: number };
  id: string;
};

export const BricksContainer = ({
  children,
  keyRoom,
  players: defaultPlayers,
}: BricksContainerProps) => {
  const [players, setPlayers] = useState<Player[]>(defaultPlayers);

  const session = useSession();
  const socket = useSocketStore((s) => s.socket);

  const PRIMARY_COL_HEIGHT = 300;
  const theme = useMantineTheme();
  const SECONDARY_COL_HEIGHT = PRIMARY_COL_HEIGHT / 2 - theme.spacing.md / 2;

  const playerRef = useRef<HTMLDivElement>(null);
  const playerPositionRef = useRef<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  console.log({ players });

  socket?.on(
    SOCKET_EVENTS.INSERT_PLAYER_ON_GAME,
    ({ playerId, keyRoom: roomId, players }) => {
      if (keyRoom !== roomId) return;

      setPlayers(
        players.map((p: Player) => ({
          id: (p as any).providerId,
          // position: p.position,
        }))
      );
    }
  );

  socket?.on(
    SOCKET_EVENTS.CHANGE_POSITION_BY_USER_ID_AND_KEY_ROOM,
    ({ position, keyRoom: roomId, playerId }) => {
      if (roomId !== keyRoom) return;

      console.log('EOPA EOPA', position);

      setPlayers((prevState) =>
        prevState.map((player) =>
          player.id === playerId ? { position, id: playerId } : player
        )
      );
    }
  );

  const handleEmitEventByPosition = useCallback(
    (position: { top: `${string}px`; left: `${string}px` }) => {
      console.log({ emited: position });
      socket?.emit(SOCKET_EVENTS.CHANGE_POSITION_BY_ROOM, {
        keyRoom,
        playerId: session.data?.user.id,
        position,
      });
    },
    [keyRoom, session.data?.user.id, socket]
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const keyDownEvent = (ev: globalThis.KeyboardEvent) => {
      const { key } = ev;

      /// width:63.55, padding: 8
      const boxMT = 63.55 + 8;
      if (!playerRef.current || !playerPositionRef.current) return;

      const playerPosition = playerPositionRef.current;

      const playerStyle = getComputedStyle(playerRef.current);

      const playerTop = Number(playerStyle.top.replace('px', ''));
      const playerLeft = Number(playerStyle.left.replace('px', ''));

      if (key === 'ArrowUp' && playerPosition.top > 0) {
        --playerPosition.top;

        handleEmitEventByPosition({
          top: `${playerTop - boxMT}px`,
          left: `${playerLeft}px`,
        });
        playerRef.current.style.top = `${playerTop - boxMT}px`;
      }
      if (key === 'ArrowDown' && playerPosition.top < 8) {
        playerPosition.top++;

        handleEmitEventByPosition({
          top: `${playerTop + boxMT}px`,
          left: `${playerLeft}px`,
        });
        playerRef.current.style.top = `${playerTop + boxMT}px`;
      }
      if (key === 'ArrowLeft' && playerPosition.left > 0) {
        playerPosition.left--;

        handleEmitEventByPosition({
          top: `${playerTop}px`,
          left: `${playerLeft - boxMT}px`,
        });

        playerRef.current.style.left = `${playerLeft - boxMT}px`;
      }
      if (key === 'ArrowRight' && playerPosition.left < 8) {
        playerPosition.left++;

        handleEmitEventByPosition({
          top: `${playerTop}px`,
          left: `${playerLeft + boxMT}px`,
        });

        playerRef.current.style.left = `${playerLeft + boxMT}px`;
      }
    };

    addEventListener('keydown', keyDownEvent);

    return () => removeEventListener('keydown', keyDownEvent);
  }, [handleEmitEventByPosition, keyRoom, session.data, socket]);

  return (
    <Container size='xl'>
      <Grid columns={12} justify='space-between'>
        <Grid.Col span={6}>
          <Grid columns={9} gutter={8}>
            <Player forwardRef={playerRef} />
            {players.map((player) => (
              <Player
                key={player.id}
                enemy
                {...(player.position || { left: 0, top: 0 })}
              />
            ))}
            {bricksArray.map((i) => (
              <Grid.Col key={i} span={1}>
                <Skeleton mih={63.55} miw={63.55} animate={false} radius='xs' />
              </Grid.Col>
            ))}
          </Grid>
        </Grid.Col>
        <Grid.Col span={5}>
          <Stack>
            <Skeleton
              height={SECONDARY_COL_HEIGHT}
              radius='md'
              animate={false}
            />
            <Skeleton
              height={SECONDARY_COL_HEIGHT}
              animate={false}
              radius='md'
            />
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

type PlayerProps = {
  forwardRef?: RefObject<HTMLDivElement>;
  top?: number;
  left?: number;
  enemy?: boolean;
};

const Player = ({ forwardRef, top, left, enemy = false }: PlayerProps) => {
  console.log(top, left);
  return (
    <Grid.Col
      span={1}
      sx={{
        position: 'absolute',
        zIndex: enemy ? 1000 : 2000,
      }}
    >
      <Paper
        ref={forwardRef}
        shadow='xs'
        radius='xs'
        p='md'
        sx={{
          position: 'relative',
          ...(!!top && { top }),
          ...(!!left && { left }),
        }}
        w={63.55}
        h={63.55}
        bg={enemy ? 'orange' : 'cyan'}
      />
    </Grid.Col>
  );
};
