import { Router } from 'express';
import {
  requestResetEmailSchema,
  resetPasswordSchema,
  userAddSchema,
  userSigninSchema,
} from '../validation/auth.js';
import { validateBody } from '../utils/validationBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  addUserController,
  logoutController,
  refreshController,
  requestResetEmailController,
  resetPasswordController,
  signinController,
} from '../controllers/auth.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(userAddSchema),
  ctrlWrapper(addUserController),
);

authRouter.post(
  '/login',
  validateBody(userSigninSchema),
  ctrlWrapper(signinController),
);

authRouter.post('/refresh', ctrlWrapper(refreshController));

authRouter.post('/logout', ctrlWrapper(logoutController));

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);
