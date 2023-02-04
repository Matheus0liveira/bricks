import prismaClient from '@/lib/prismadb';
import { PrismaClient } from '@prisma/client';

class RoomClient {
  constructor(private readonly dbClient: PrismaClient['room']) {}

  async create(providerId: string) {
    return this.dbClient.create({
      data: { players: { connect: { providerId } } },
    });
  }

  async find(id: string) {
    return this.dbClient.findUnique({
      where: { id },
    });
  }
}

export const roomDbClient = new RoomClient(prismaClient.room);
