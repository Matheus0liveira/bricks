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
  // const [currentSelected, setCurrentSelected] = useState(0);
  // const flexRef = useRef<HTMLDivElement>(null);

  // const checkEvent = useCallback(() => {
  //   if (!flexRef.current)
  //     return {
  //       isUpRow: false,
  //       isDownRow: false,
  //       isLeftColumn: false,
  //       isRightColumn: false,
  //     };

  //   const grid = flexRef.current;

  //   const active = grid.querySelector('.active');
  //   const activeIndex = Array.from(grid.children).indexOf(active as Element);

  //   const gridChildren = Array.from(grid.children);
  //   const gridNum = gridChildren.length;
  //   const baseOffset = (gridChildren[0] as any).offsetTop;
  //   const breakIndex = gridChildren.findIndex(
  //     (item) => (item as any).offsetTop > baseOffset
  //   );
  //   const numPerRow = breakIndex === -1 ? gridNum : breakIndex;

  //   const isUpRow = activeIndex <= numPerRow - 1;
  //   const isDownRow = activeIndex >= gridNum - numPerRow;
  //   const isLeftColumn = activeIndex % numPerRow === 0;
  //   const isRightColumn =
  //     activeIndex % numPerRow === numPerRow - 1 || activeIndex === gridNum - 1;

  //   console.log({ isUpRow, isDownRow, isLeftColumn, isRightColumn });

  //   return { isUpRow, isDownRow, isLeftColumn, isRightColumn };
  // }, []);

  // const handleUpdateItem = useCallback(
  //   (type: 'up' | 'down' | 'left' | 'right') => {
  //     if (type === 'up') return setCurrentSelected((pv) => pv - 10);
  //     if (type === 'down') return setCurrentSelected((pv) => pv + 10);
  //     if (type === 'left') return setCurrentSelected((pv) => pv - 1);
  //     if (type === 'right') return setCurrentSelected((pv) => pv + 1);
  //   },
  //   []
  // );

  // const keyFuncs = useMemo<KeyFuncs>(() => {
  //   return {
  //     ArrowUp: (c) => !c().isUpRow && handleUpdateItem('up'),
  //     ArrowDown: (c) => !c().isDownRow && handleUpdateItem('down'),
  //     ArrowLeft: (c) => !c().isLeftColumn && handleUpdateItem('left'),
  //     ArrowRight: (c) => !c().isRightColumn && handleUpdateItem('right'),
  //   };
  // }, [handleUpdateItem]);

  // useEffect(() => {
  //   if (typeof document === 'undefined') return;

  //   const keyDownEvent = (ev: globalThis.KeyboardEvent) => {
  //     const { key } = ev;

  //     if (!['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(key))
  //       return;

  //     keyFuncs[key as KeyVariables](checkEvent);
  //   };

  //   addEventListener('keydown', keyDownEvent);

  //   return () => removeEventListener('keydown', keyDownEvent);
  // }, [checkEvent, keyFuncs]);

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
