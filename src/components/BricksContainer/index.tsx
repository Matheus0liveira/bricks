import { useGameStore } from '@/stores/game.store';
import { Flex as MantineFlex, Container } from '@mantine/core';
import {
  forwardRef,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';

type KeyVariables = 'ArrowUp' | 'ArrowRight' | 'ArrowDown' | 'ArrowLeft';

type CheckEvent = () => {
  isUpRow: boolean;
  isDownRow: boolean;
  isLeftColumn: boolean;
  isRightColumn: boolean;
};

type KeyFuncs = Record<KeyVariables, (c: CheckEvent) => void | false>;

export const BricksContainer = forwardRef<HTMLDivElement, PropsWithChildren>(
  ({ children }) => {
    const flexRef = useRef<HTMLDivElement>(null);
    const handleChangeSelect = useGameStore(
      (store) => store.handleChangeSelect
    );

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
        activeIndex % numPerRow === numPerRow - 1 ||
        activeIndex === gridNum - 1;

      console.log({ isUpRow, isDownRow, isLeftColumn, isRightColumn });

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

    return (
      <Container maw={500}>
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
      </Container>
    );
  }
);
