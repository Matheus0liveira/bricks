import { connect, Socket } from 'socket.io-client';
import { create } from 'zustand';

export type SocketStore = {
  socket?: Socket;

  /**
   * @deprecated
   */
  changeSocket: (s: Socket) => void;
  setSocket: () => void;
};

export const useSocketStore = create<SocketStore>((set) => ({
  changeSocket(socket) {
    set((s) => ({ ...s, socket }));
  },
  setSocket() {
    const socket = connect('http://localhost:3000', {
      path: '/api/socketio',
    });

    // log socket connection
    socket.on('connect', () => {
      console.log('SOCKET CONNECTED!', socket.id);
    });

    set((s) => ({ ...s, socket }));
  },
}));
