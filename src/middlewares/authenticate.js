import createHttpError from 'http-errors';
import { findSession, findUser } from '../services/auth.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    next(createHttpError(401, 'Please provide Authorization header'));
    return;
  }

  const [bearer, accessToken] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !accessToken) {
    next(createHttpError(401, 'Auth header should be of type Bearer'));
    return;
  }

  const session = await findSession({ accessToken });
  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  const accessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);
  if (accessTokenExpired) {
    next(createHttpError(401, 'Access token expired'));
    return;
  }

  const user = await findUser({ _id: session.userId });
  if (!user) {
    next(createHttpError(401, 'User not found'));
    return;
  }

  req.user = user;

  next();
};
