import bcrypt from 'bcrypt';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';

export const findUser = (filter) => User.findOne(filter);

export const findSession = (filter) => Session.findOne(filter);

export const signup = async (data) => {
  const { password } = data;
  const hashPass = await bcrypt.hash(password, 10);
  return User.create({ ...data, password: hashPass });
};
