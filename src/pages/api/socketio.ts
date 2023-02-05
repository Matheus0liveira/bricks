/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/next';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';
import { SOCKET_EVENTS } from '@/types/socketEvents';
import { playerDbClient } from '@/services/db/playerClient';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log('New Socket.io server...');

    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: '/api/socketio',
    });

    io.sockets.on('connection', function (socket) {
      socket.on(SOCKET_EVENTS.ENTER_ROOM, async ({ playerId, keyRoom }) => {
        const players = await playerDbClient.findAllPlayersByRoomId(keyRoom);

        socket.broadcast.emit(SOCKET_EVENTS.INSERT_PLAYER_ON_GAME, {
          playerId,
          keyRoom,
          players,
        });
      });
      socket.on(
        SOCKET_EVENTS.CHANGE_POSITION_BY_ROOM,
        ({ keyRoom, position, playerId, name }) => {
          socket.broadcast.emit(
            SOCKET_EVENTS.CHANGE_POSITION_BY_USER_ID_AND_KEY_ROOM,
            {
              position,
              keyRoom,
              playerId,
              name,
            }
          );
        }
      );
    });
    res.socket.server.io = io;
  }
  res.end();
};
