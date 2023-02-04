import { Socket } from 'socket.io-client';
import { create } from 'zustand';

export type SocketStore = {
  socket?: Socket;
  changeSocket: (s: Socket) => void;
};

export const useSocketStore = create<SocketStore>((set) => ({
  changeSocket(socket) {
    set((s) => ({ ...s, socket }));
  },
}));
