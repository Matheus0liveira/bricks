import { BricksContainer } from '@/components/BricksContainer';
import { Brick } from '@/components/Brick';
import { bricksArray, getServerCookie } from '@/utils';
import { Layout } from '@/components/Layout';
import { CtxWithSession, getServerSideSession } from '@/hocs/withSession';
import { COOKIES } from '@/shared/cookies';
import { SOCKET_EVENTS } from '@/types/socketEvents';
import { useSocketStore } from '@/stores/socket.store';
import { GameService } from '@/services/game.service';
import { Player } from '@prisma/client';

type HomeProps = {
  keyRoom: string;
  players: Player[];
};

export default function Home({ keyRoom, players }: HomeProps) {
  return (
    <Layout>
      <BricksContainer
        keyRoom={keyRoom}
        players={players.map((p) => ({ id: p.providerId }))}
      >
        {bricksArray.map((i, index) => (
          <Brick key={i} index={index} />
        ))}
      </BricksContainer>
    </Layout>
  );
}

export const getServerSideProps = getServerSideSession(async (ctx) => {
  const keyRoom = getServerCookie(ctx, COOKIES.KEY_ROOM);

  if (!keyRoom) {
    return {
      redirect: {
        destination: '/room',
        permanent: false,
      },
    };
  }
  const { getPlayersByRoomIdAndPlayerId } = new GameService();

  const session = (ctx as CtxWithSession).session;

  const { players } = await getPlayersByRoomIdAndPlayerId({
    playerId: session.user.id,
    keyRoom,
  });

  return {
    props: {
      keyRoom,
      players: players.filter(
        (player) => player.providerId !== session.user.id
      ),
    },
  };
});
