import { RequestHandler } from 'express';
import HttpStatus from 'http-status-codes';

import {
  findWhiteboardById,
  pullWhiteboardData,
  pushWhiteboardData
} from '../../../db/whiteboard';

const updateWhiteboardHandler: RequestHandler = async (req, res) => {
  const { whiteboardId } = req.params;
  const whiteboard = await findWhiteboardById(whiteboardId);
  if (!whiteboard) {
    res.sendStatus(HttpStatus.NOT_FOUND);
    return;
  }

  if (
    !whiteboard.users.find(
      user => user.id === req.userId && user.role === 'author'
    )
  ) {
    res.sendStatus(HttpStatus.FORBIDDEN);
    return;
  }

  const transport /*: DrawTransport */ = req.body; // TODO: validate schema...

  const update = await (async () => {
    if (transport.action === 'add') {
      return pushWhiteboardData(whiteboardId, transport.events);
    }
    return pullWhiteboardData(whiteboardId, transport.events);
  })();

  if (update.modifiedCount) {
    res.sendStatus(HttpStatus.OK);
  } else {
    res.send(HttpStatus.INTERNAL_SERVER_ERROR);
  }
};

export default updateWhiteboardHandler;
