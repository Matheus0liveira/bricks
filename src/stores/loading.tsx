import { create } from 'zustand';

export type UseLoading = {
  isLoading: number;
  showLoading(): void;
  hideLoading(): void;
};

export const useLoading = create<UseLoading>((set) => ({
  isLoading: 0,
  showLoading() {
    set((s) => ({ ...s, isLoading: ++s.isLoading }));
  },
  hideLoading() {
    set((s) => ({ ...s, isLoading: --s.isLoading }));
  },
}));
