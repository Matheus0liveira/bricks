/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/types/next';

export default (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === 'POST') {
    // get message
    const position = req.body;
    console.log({ position });
    // dispatch to channel "position"
    res?.socket?.server?.io?.emit('change-position', position);

    // return message
    res.status(201).json(position);
  }
};
