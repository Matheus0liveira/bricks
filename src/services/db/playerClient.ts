import prismaClient from '@/lib/prismadb';
import { PrismaClient } from '@prisma/client';

class PlayerClient {
  constructor(private readonly dbClient: PrismaClient['player']) {}

  async create(providerId: string, providerType: 'google' | 'github') {
    return this.dbClient.create({ data: { providerId, providerType } });
  }
  async disconnectRoomByProviderId(providerId: string) {
    return this.dbClient.update({
      where: { providerId },
      data: { Room: { disconnect: true } },
    });
  }
  async connectRoomByPlayerId(id: string, roomId: string) {
    return this.dbClient.update({
      where: { id },
      data: { Room: { connect: { id: roomId } } },
    });
  }

  async find(providerId: string) {
    return this.dbClient.findUnique({
      where: { providerId },
    });
  }
  async findAllPlayersByRoomId(roomId: string) {
    return this.dbClient.findMany({ where: { roomId } });
  }
}

export const playerDbClient = new PlayerClient(prismaClient['player']);
