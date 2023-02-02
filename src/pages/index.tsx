import { BricksContainer } from '@/components/BricksContainer';
import { Brick } from '@/components/Brick';
import { bricksArray, getServerCookie } from '@/utils';
import { Layout } from '@/components/Layout';
import { getServerSideSession } from '@/hocs/withSession';
import { COOKIES } from '@/shared/cookies';

export default function Home() {
  return (
    <Layout>
      <BricksContainer>
        {bricksArray.map((i, index) => (
          <Brick key={i} index={index} />
        ))}
      </BricksContainer>
    </Layout>
  );
}

export const getServerSideProps = getServerSideSession(async (ctx) => {
  const roomKey = getServerCookie(ctx, COOKIES.ROOM_KEY);

  if (!roomKey) {
    return {
      redirect: {
        destination: '/room',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
});
