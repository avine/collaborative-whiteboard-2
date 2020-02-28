import { RequestHandler } from 'express';
import HttpStatus from 'http-status-codes';

import { comparePassword } from '../../../common/hash-password';
import { validateSchema } from '../../../common/validate-schema';
import { getDefaultDb } from '../../../db/db.params';
import { userLoginSchema } from '../user.schemas';
import { User, UserLogin } from '../user.types';

const signInHandler: RequestHandler = async (req, res) => {
  const { email, password }: UserLogin = req.body;

  const errors = validateSchema(userLoginSchema, { email, password });
  if (errors) {
    res.sendStatus(HttpStatus.BAD_REQUEST);
    return;
  }

  const db = await getDefaultDb();
  const users = db.collection<User>('users');
  const user = await users.findOne({ email });
  if (!user || !(await comparePassword(password, user.password))) {
    res.sendStatus(HttpStatus.UNAUTHORIZED);
    return;
  }

  // TODO...
  // eslint-disable-next-line no-underscore-dangle
  const jwt = user._id;
  res.send(jwt);
};

export default signInHandler;