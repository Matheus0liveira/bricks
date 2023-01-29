import { create } from 'zustand';
import { TOTAL_COLS as COLUMNS } from '@/utils';
import { GameService } from '@/services/game.service';

export type UseGameStore = {
  status: 'paused' | 'running';
  currentSelect: number;
  currentPointPosition: number | null;
  handleChangeSelect: (type: 'up' | 'down' | 'left' | 'right') => void;
  handleChangePointPosition: (position: number | null) => void;
  toggleStatus: () => void;
};

export const useGameStore = create<UseGameStore>((set) => {
  const service = new GameService();

  return {
    status: 'paused',
    currentSelect: 0,
    currentPointPosition: null,
    handleChangePointPosition(position) {
      return set((s) => ({ ...s, currentPointPosition: position }));
    },
    handleChangeSelect(type) {
      if (type === 'up') {
        return set((s) => {
          const newPosition = s.currentSelect - COLUMNS;
          service.sendPosition(newPosition);
          return { ...s, currentSelect: newPosition };
        });
      }
      if (type === 'down') {
        return set((s) => {
          const newPosition = s.currentSelect + COLUMNS;
          service.sendPosition(newPosition);

          return { ...s, currentSelect: newPosition };
        });
      }
      if (type === 'left') {
        return set((s) => {
          const newPosition = s.currentSelect - 1;
          service.sendPosition(newPosition);
          return { ...s, currentSelect: newPosition };
        });
      }
      if (type === 'right') {
        return set((s) => {
          const newPosition = s.currentSelect + 1;
          service.sendPosition(newPosition);

          return { ...s, currentSelect: newPosition };
        });
      }
    },
    toggleStatus() {
      return set((s) => ({
        ...s,
        status: s.status === 'paused' ? 'running' : 'paused',
      }));
    },
  };
});
