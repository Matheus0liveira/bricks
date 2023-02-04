/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/next';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';
import { SOCKET_EVENTS } from '@/types/socketEvents';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log('New Socket.io server...');
    // adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: '/api/socketio',
    });

    io.sockets.on('connection', function (socket) {
      socket.on(SOCKET_EVENTS.ENTER_ROOM, ({ playerId, keyRoom }) => {
        socket.broadcast.emit(SOCKET_EVENTS.INSERT_PLAYER_ON_GAME, {
          playerId,
          keyRoom,
        });
      });
      socket.on(
        SOCKET_EVENTS.CHANGE_POSITION_BY_ROOM,
        ({ keyRoom, position, playerId }) => {
          socket.broadcast.emit(
            SOCKET_EVENTS.CHANGE_POSITION_BY_USER_ID_AND_KEY_ROOM,
            {
              position,
              keyRoom,
              playerId,
            }
          );
        }
      );
    });
    res.socket.server.io = io;
  }
  res.end();
};
