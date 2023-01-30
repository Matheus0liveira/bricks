import { BricksContainer } from '@/components/BricksContainer';
import { Brick } from '@/components/Brick';
import { bricksArray } from '@/utils';
import { Layout } from '@/components/Layout';
import { getServerSideSession } from '@/hocs/withSession';

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
  // @ts-ignore
  console.log({ session: ctx.session });

  return {
    props: {},
  };
});
