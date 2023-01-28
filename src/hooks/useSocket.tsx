import { useEffect } from 'react';
import { connect, Socket } from 'socket.io-client';

type CallBack = (socket: Socket) => void;

export const useSocket = (cb: CallBack) => {
  useEffect((): any => {
    // connect to socket server
    const socket = connect('http://localhost:3000', {
      path: '/api/socketio',
    });

    // log socket connection
    socket.on('connect', () => {
      console.log('SOCKET CONNECTED!', socket.id);
    });

    cb(socket);

    // socket disconnet onUnmount if exists
    if (socket) return () => socket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
