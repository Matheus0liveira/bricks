import { BricksContainer } from '@/components/BricksContainer';
import { Brick } from '@/components/Brick';
import { bricksArray } from '@/utils';
import { Layout } from '@/components/Layout';

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
