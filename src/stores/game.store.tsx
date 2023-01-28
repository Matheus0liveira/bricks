import { create } from 'zustand';
import { TOTAL_COLS as COLUMNS } from '@/utils';

export type UseGameStore = {
  currentSelect: number;
  handleChangeSelect: (type: 'up' | 'down' | 'left' | 'right') => void;
};

export const useGameStore = create<UseGameStore>((set) => ({
  currentSelect: 0,
  handleChangeSelect(type) {
    if (type === 'up') {
      return set((s) => ({ ...s, currentSelect: s.currentSelect - COLUMNS }));
    }
    if (type === 'down') {
      return set((s) => ({ ...s, currentSelect: s.currentSelect + COLUMNS }));
    }
    if (type === 'left') {
      return set((s) => ({ ...s, currentSelect: s.currentSelect - 1 }));
    }
    if (type === 'right') {
      return set((s) => ({ ...s, currentSelect: s.currentSelect + 1 }));
    }
  },
}));
