import { useGameStore } from '@/stores/game.store';
import { Box } from '@mantine/core';

type BricksProps = {
  index: number;
};

export function Bricks({ index }: BricksProps) {
  const currentSelect = useGameStore((state) => state.currentSelect);

  return (
    <Box
      bg={currentSelect === index ? 'grape' : 'gray'}
      className={currentSelect === index ? 'active' : undefined}
      w={40}
      h={40}
      display='flex'
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '2px',
        transition: 'background .2s ease-in',
        borderWidth: currentSelect === index ? '2px' : '1px',
        borderStyle: 'dashed',
        borderColor: currentSelect === index ? 'grape' : 'gray',
      }}
    >
      <p style={{ opacity: currentSelect === index ? '0.5' : '0.06' }}>
        {' '}
        {index.toFixed().padStart(2, '0')}
      </p>
    </Box>
  );
}
