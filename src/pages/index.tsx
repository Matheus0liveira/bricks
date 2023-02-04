import { BricksContainer } from '@/components/BricksContainer';
import { Brick } from '@/components/Brick';
import { bricksArray, getServerCookie } from '@/utils';
import { Layout } from '@/components/Layout';
import { CtxWithSession, getServerSideSession } from '@/hocs/withSession';
import { COOKIES } from '@/shared/cookies';
import { Session } from 'next-auth';

type HomeProps = {
  keyRoom: string;
};

export default function Home({ keyRoom }: HomeProps) {
  return (
    <Layout>
      <BricksContainer keyRoom={keyRoom}>
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

  return {
    props: {
      keyRoom,
    },
  };
});
