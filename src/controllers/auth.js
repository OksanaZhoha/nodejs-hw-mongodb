import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';

import {
  findSession,
  findUser,
  requestResetToken,
  resetPassword,
  signup,
} from '../services/auth.js';
import { createSession, deleteSession } from '../services/session.js';

export const addUserController = async (req, res, next) => {
  const { email } = req.body;
  const user = await findUser({ email });
  if (user) {
    next(createHttpError(409, 'Email in use'));
    return;
  }

  const newUser = await signup(req.body);

  const data = {
    name: newUser.name,
    email: newUser.email,
  };

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data,
  });
};

const setupResSession = (
  res,
  { refreshToken, refreshTokenValidUntil, _id },
) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });

  res.cookie('sessionId', _id, {
    httpOnly: true,
    expires: refreshTokenValidUntil,
  });
};

export const signinController = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findUser({ email });
  if (!user) {
    next(createHttpError(401, 'Email is invalid'));
    return;
  }

  const passCompare = await bcrypt.compare(password, user.password);
  if (!passCompare) {
    next(createHttpError(401, 'Password invalid'));
    return;
  }

  const session = await createSession(user._id);

  setupResSession(res, session);

  res.status(201).json({
    status: 201,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshController = async (req, res, next) => {
  const { refreshToken, sessionId } = req.cookies;

  const currentSession = await findSession({ _id: sessionId, refreshToken });

  if (!currentSession) {
    return next(createHttpError(401, 'Session not found'));
  }

  const refreshTokenExpired =
    new Date() > new Date(currentSession.refreshTokenValidUntil);

  if (refreshTokenExpired) {
    return next(createHttpError(401, 'Session expired'));
  }

  const newSession = await createSession(currentSession.userId);

  setupResSession(res, newSession);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: newSession.accessToken,
    },
  });
};

export const logoutController = async (req, res, next) => {
  const { sessionId } = req.cookies;
  if (!sessionId) {
    return next(createHttpError(401, 'Session not found'));
  }

  await deleteSession({ _id: sessionId });

  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email),
    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent',
      data: {},
    });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset',
    data: {},
  });
};
