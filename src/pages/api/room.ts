/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/next';

export default (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === 'POST') {
    const { roomKey } = req.body;
    const { io } = res?.socket?.server;

    io?.emit('enter-room', roomKey);

    res.status(201).json({ ok: true });
  }
};
