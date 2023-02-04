/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/next';
import APIError from '@/errors/ApiError';
import { playerDbClient } from '@/services/db/playerClient';
import { roomDbClient } from '@/services/db/roomClient';

type Body = {
  keyRoom: string;
  playerId: string;
  isOwner: boolean;
};

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === 'PATCH') {
    try {
      const { keyRoom, playerId, isOwner = false } = req.body as Body;

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

      await playerDbClient.disconnectRoomByProviderId(player?.providerId);

      if (isOwner) {
        const room = await roomDbClient.create(player.providerId);

        return res.status(201).json({ room, player });
      }

      const room = await roomDbClient.find(keyRoom);

      if (!room) {
        throw new APIError({
          status: 400,
          statusText: 'EITA BIXU!, agora lascou mesmo, seu juninho :(',
        });
      }

      await playerDbClient.connectRoomByPlayerId(player.id, room.id);

      res.status(201).json({ room, player });
    } catch (e) {
      if (e instanceof APIError) {
        res.status(e.response.status).json({ message: e.message });
      }

      res.status(501).json({ error: e });
    }
  }
};
