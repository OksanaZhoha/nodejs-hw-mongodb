import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pino from 'pino-http';
import 'dotenv/config';
import { env } from './utils/env.js';
import { contactsRouter } from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { authRouter } from './routers/auth.js';
import { PUBLIC_DIR } from './constans/uploadFiles.js';

const port = env('PORT', '3000');

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(express.static(PUBLIC_DIR));

  app.use(cors());
  app.use(cookieParser());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(port, () => console.log(`Server is running on port ${port}`));
};
