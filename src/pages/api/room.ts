/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/next';
import APIError from '@/errors/ApiError';
import { playerDbClient } from '@/services/db/playerClient';
import { Player, Room } from '@prisma/client';
import { ApiError } from 'next/dist/server/api-utils';
import { roomDbClient } from '@/services/db/roomClient';

type Body = {
  keyRoom: string;
  playerId: string;
  isOwner: boolean;
};

type Payload = {
  player: Player;
  room: Room;
  playersInRoom: Player[];
};

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === 'GET') {
    try {
      const { keyRoom, playerId } = req.query;

      if (typeof keyRoom !== 'string' || typeof playerId !== 'string') {
        throw new ApiError(401, 'AIAIAI, Se vira');
      }

      const players = await playerDbClient.findAllPlayersByRoomId(keyRoom);

      if (!players.find((p) => p.providerId === playerId)) {
        throw new ApiError(401, 'HAHAHA, Vai achando bobão');
      }

      return res.status(200).json({ players });
    } catch (e) {
      return res.status(200).json({ ok: false });
    }
  }
  if (req.method === 'PATCH') {
    try {
      const { keyRoom, playerId, isOwner = false } = req.body as Body;
      let payload: Payload = {
        player: {} as Player,
        playersInRoom: [],
        room: {} as Room,
      };

      if (!playerId) {
        throw new APIError({
          status: 400,
          statusText: 'EITA BIXU!, se vira com teus BO, seu juninho ;)',
        });
      }

      if (!isOwner && !keyRoom) {
        throw new APIError({
          status: 400,
          statusText: 'EITA BIXU!, se vira com teus BO, seu juninho :[',
        });
      }

      const player = await playerDbClient.find(playerId);

      if (!player) {
        throw new APIError({
          status: 400,
          statusText: 'EITA BIXU!, se vira com teus BO, seu juninho :|',
        });
      }

      payload.player = player;

      await playerDbClient.disconnectRoomByProviderId(
        payload.player?.providerId
      );

      if (isOwner) {
        payload.room = await roomDbClient.create(player.providerId, player.id);
      } else {
        const room = await roomDbClient.find(keyRoom);
        if (!room) {
          throw new APIError({
            status: 400,
            statusText: 'EITA BIXU!, agora lascou mesmo, seu juninho :(',
          });
        }

        payload.room = room;
      }

      await playerDbClient.connectRoomByPlayerId(
        payload.player.id,
        payload.room.id
      );

      res.status(201).json(payload);
    } catch (e) {
      if (e instanceof APIError) {
        res.status(e.response.status).json({ message: e.message });
      }

      res.status(501).json({ error: e });
    }
  }
};
