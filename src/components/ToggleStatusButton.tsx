import { useGameStore } from '@/stores/game.store';
import { Button } from '@mantine/core';
import { memo } from 'react';
import { PlayerPause, PlayerPlay } from 'tabler-icons-react';

type ToggleStatusProps = {
  handleChangeStatus(): void;
};

export const ToggleStatus = memo(
  ({ handleChangeStatus }: ToggleStatusProps) => {
    const status = useGameStore((s) => s.status);

    return (
      <Button
        size='md'
        variant='default'
        leftIcon={status === 'paused' ? <PlayerPlay /> : <PlayerPause />}
        onClick={handleChangeStatus}
      >
        {status === 'paused' ? 'Start' : 'Pause'}
      </Button>
    );
  }
);
