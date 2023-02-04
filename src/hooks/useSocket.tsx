import { useEffect, useState } from 'react';
import { connect, Socket } from 'socket.io-client';

type CallBack = (socket: Socket) => void;

export const useSocket = (cb?: CallBack) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect((): any => {
    // connect to socket server

    const s = connect('http://localhost:3000', {
      path: '/api/socketio',
    });
    setSocket(s);

    // log socket connection
    s.on('connect', () => {
      console.log('SOCKET CONNECTED!', s.id);
      cb?.(s);
    });
    // socket disconnet onUnmount if exists
    if (socket) return () => socket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { socket };
};
