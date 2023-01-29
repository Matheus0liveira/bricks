import { useGameStore } from '@/stores/game.store';
import { TOTAL_COLS, TOTAL_ROWS } from '@/utils';
import { Flex as MantineFlex, Container, Button, Header } from '@mantine/core';
import {
  memo,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { ToggleStatus } from '../ToggleStatusButton';

const tree = [23, 24, 25, 26, 36, 46, 45, 44, 43, 56, 66, 65, 64, 63];
const two = [23, 24, 25, 26, 36, 46, 45, 44, 43, 53, 63, 64, 65, 66];
const one = [25, 35, 45, 55, 65];

type KeyVariables = 'ArrowUp' | 'ArrowRight' | 'ArrowDown' | 'ArrowLeft';

type CheckEvent = () => {
  isUpRow: boolean;
  isDownRow: boolean;
  isLeftColumn: boolean;
  isRightColumn: boolean;
};

type KeyFuncs = Record<KeyVariables, (c: CheckEvent) => void | false>;

export const BricksContainer = ({ children }: PropsWithChildren) => {
  const flexRef = useRef<HTMLDivElement>(null);
  const handleChangeSelect = useGameStore((s) => s.handleChangeSelect);
  const currentPointPosition = useGameStore((s) => s.currentPointPosition);
  const handleChangePointPosition = useGameStore(
    (s) => s.handleChangePointPosition
  );
  const status = useGameStore((s) => s.status);
  const toggleStatus = useGameStore((s) => s.toggleStatus);
  const currentSelect = useGameStore((s) => s.currentSelect);

  const checkEvent = useCallback(() => {
    if (!flexRef.current)
      return {
        isUpRow: false,
        isDownRow: false,
        isLeftColumn: false,
        isRightColumn: false,
      };

    const grid = flexRef.current;

    const active = grid.querySelector('.active');
    const activeIndex = Array.from(grid.children).indexOf(active as Element);

    const gridChildren = Array.from(grid.children);
    const gridNum = gridChildren.length;
    const baseOffset = (gridChildren[0] as any).offsetTop;
    const breakIndex = gridChildren.findIndex(
      (item) => (item as any).offsetTop > baseOffset
    );
    const numPerRow = breakIndex === -1 ? gridNum : breakIndex;

    const isUpRow = activeIndex <= numPerRow - 1;
    const isDownRow = activeIndex >= gridNum - numPerRow;
    const isLeftColumn = activeIndex % numPerRow === 0;
    const isRightColumn =
      activeIndex % numPerRow === numPerRow - 1 || activeIndex === gridNum - 1;

    return { isUpRow, isDownRow, isLeftColumn, isRightColumn };
  }, []);

  const handleUpdateItem = useCallback(
    (type: 'up' | 'down' | 'left' | 'right') => handleChangeSelect(type),
    [handleChangeSelect]
  );

  const keyFuncs = useMemo<KeyFuncs>(() => {
    return {
      ArrowUp: (c) => !c().isUpRow && handleUpdateItem('up'),
      ArrowDown: (c) => !c().isDownRow && handleUpdateItem('down'),
      ArrowLeft: (c) => !c().isLeftColumn && handleUpdateItem('left'),
      ArrowRight: (c) => !c().isRightColumn && handleUpdateItem('right'),
    };
  }, [handleUpdateItem]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const keyDownEvent = (ev: globalThis.KeyboardEvent) => {
      const { key } = ev;

      if (!['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(key))
        return;

      keyFuncs[key as KeyVariables](checkEvent);
    };

    addEventListener('keydown', keyDownEvent);

    return () => removeEventListener('keydown', keyDownEvent);
  }, [checkEvent, keyFuncs]);

  useEffect(() => {
    if (currentSelect === currentPointPosition && status === 'running') {
      handleChangePointPosition(generatePointNumber());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSelect]);

  const generatePointNumber = useCallback(() => {
    let num: number = Math.floor(Math.random() * (TOTAL_COLS * TOTAL_ROWS));

    if (num === currentSelect) {
      return Math.floor(Math.random() * (TOTAL_COLS * TOTAL_ROWS));
    }
    return num;
  }, [currentSelect]);

  const handleChangeStatus = useCallback(() => {
    toggleStatus();

    if (status === 'running') {
      return handleChangePointPosition(null);
    }

    handleChangePointPosition(generatePointNumber());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <MyContainer>
      <Header height={56} mb={16}>
        <ToggleStatus handleChangeStatus={handleChangeStatus} />
      </Header>
      <MantineFlex
        ref={flexRef}
        mih={50}
        gap={5}
        justify='flex-start'
        align='flex-start'
        direction='row'
        wrap='wrap'
      >
        {children}
      </MantineFlex>
    </MyContainer>
  );
};

const MyContainer = memo(({ children }: PropsWithChildren) => (
  <Container maw={453}>{children}</Container>
));
