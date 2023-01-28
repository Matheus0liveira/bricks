/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/next';

export default (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === 'POST') {
    const { position } = req.body;
    res?.socket?.server?.io?.emit('change-position', position);

    res.status(201);
  }
};
