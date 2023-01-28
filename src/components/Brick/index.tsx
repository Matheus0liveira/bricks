import { useGameStore } from '@/stores/game.store';
import { Box, DefaultMantineColor } from '@mantine/core';
import { memo } from 'react';

type BricksProps = {
  index: number;
};

function BricksComponent({ index }: BricksProps) {
  const currentSelect = useGameStore((s) => s.currentSelect);
  const currentPointPosition = useGameStore((s) => s.currentPointPosition);

  const isPlayerPosition = currentSelect === index;
  const isPointPosition = currentPointPosition === index;

  const isPlayerPositionEqualPointPosition =
    isPointPosition && isPlayerPosition;

  const BgPlayerOrPointPosition: DefaultMantineColor = isPointPosition
    ? isPlayerPositionEqualPointPosition
      ? 'purple'
      : 'indigo'
    : 'purple';

  const BgDefaultBrick = 'gray';

  return (
    <Box
      bg={
        isPlayerPosition || isPointPosition
          ? BgPlayerOrPointPosition
          : BgDefaultBrick
      }
      className={isPlayerPosition ? 'active' : undefined}
      w={40}
      h={40}
      display='flex'
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '2px',
        transition: 'background .2s ease-in',
        borderWidth: isPlayerPosition || isPointPosition ? '2px' : '1px',
        borderStyle: 'dashed',
        borderColor: isPlayerPosition ? 'grape' : 'gray',
      }}
    >
      <p style={{ opacity: isPlayerPosition ? '0.5' : '0.06' }}>
        {index.toFixed().padStart(2, '0')}
      </p>
    </Box>
  );
}

export const Bricks = memo(BricksComponent);
