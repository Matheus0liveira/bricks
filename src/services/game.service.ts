import { Player, Room } from '@prisma/client';
import HttpClient from './utils/HttpClient';

type ChangeRoomByPlayerId = {
  playerId: string;
  keyRoom?: string;
  isOwner?: boolean;
};
type GetPlayersByRoomIdAndPlayerId = {
  playerId: string;
  keyRoom?: string;
};
type ResultGetPlayersByRoomIdAndPlayerId = {
  players: Player[];
};

type ResultChangeRoomByPlayerId = {
  players: Player;
};

export class GameService {
  async sendPosition(position: number) {
    const httpClient = new HttpClient('http://localhost:3000');
    await httpClient.post('/api/game', { body: { position } });
  }
  async changeRoomByPlayerId(body: ChangeRoomByPlayerId) {
    const httpClient = new HttpClient('http://localhost:3000');
    return httpClient.patch<ResultChangeRoomByPlayerId>('/api/room', { body });
  }
  async getPlayersByRoomIdAndPlayerId({
    playerId,
    keyRoom,
  }: GetPlayersByRoomIdAndPlayerId) {
    const httpClient = new HttpClient('http://localhost:3000');
    return httpClient.get<ResultGetPlayersByRoomIdAndPlayerId>(
      `/api/room?playerId=${playerId}&keyRoom=${keyRoom}`
    );
  }
}
