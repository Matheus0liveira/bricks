import { Player, Room } from '@prisma/client';
import HttpClient from './utils/HttpClient';

type ChangeRoomByPlayerId = {
  playerId: string;
  keyRoom?: string;
  isOwner?: boolean;
};

type ResultChangeRoomByPlayerId = {
  room: Room;
  player: Player;
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
}
