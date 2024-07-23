import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';

import { env } from '../utils/env.js';
import { sendMail } from '../utils/sendMail.js';
import { SMTP } from '../constans/auth.js';

export const findUser = (filter) => User.findOne(filter);

export const findSession = (filter) => Session.findOne(filter);

export const signup = async (data) => {
  const { password } = data;
  const hashPass = await bcrypt.hash(password, 10);
  return User.create({ ...data, password: hashPass });
};

export const requestResetToken = async (email) => {
  const user = await findUser({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    { expiresIn: '72h' },
  );

  const appDomain = env('APP_DOMAIN');

  await sendMail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a target="blank" href="${appDomain}/auth/reset-password?token=${resetToken}"</a> to reset your password!</p>`,
  });
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (error) {
    if (error instanceof Error) {
      throw createHttpError(401, 'Token is expired or invalid');
    }
  }

  const user = await findUser({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await User.updateOne({ _id: user._id }, { password: encryptedPassword });
};
