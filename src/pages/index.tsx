import { BricksContainer } from '@/components/BricksContainer';
import { Bricks } from '@/components/Bricks';
import { bricksArray } from '@/utils';
import { Layout } from '@/components/Layout';

type KeyVariables = 'ArrowUp' | 'ArrowRight' | 'ArrowDown' | 'ArrowLeft';

type CheckEvent = () => {
  isUpRow: boolean;
  isDownRow: boolean;
  isLeftColumn: boolean;
  isRightColumn: boolean;
};

type KeyFuncs = Record<KeyVariables, (c: CheckEvent) => void | false>;

export default function Home() {
  return (
    <Layout>
      <BricksContainer>
        {bricksArray.map((i, index) => (
          <Bricks key={i} index={index} />
        ))}
      </BricksContainer>
    </Layout>
  );
}
