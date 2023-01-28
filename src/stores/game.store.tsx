import { create } from 'zustand';
import { TOTAL_COLS as COLUMNS } from '@/utils';

export type UseGameStore = {
  status: 'paused' | 'running';
  currentSelect: number;
  currentPointPosition: number | null;
  handleChangeSelect: (type: 'up' | 'down' | 'left' | 'right') => void;
  handleChangePointPosition: (position: number | null) => void;
  toggleStatus: () => void;
};

export const useGameStore = create<UseGameStore>((set) => ({
  status: 'paused',
  currentSelect: 0,
  currentPointPosition: null,
  handleChangePointPosition(position) {
    return set((s) => ({ ...s, currentPointPosition: position }));
  },
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
  toggleStatus() {
    return set((s) => ({
      ...s,
      status: s.status === 'paused' ? 'running' : 'paused',
    }));
  },
}));
