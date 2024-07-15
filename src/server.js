import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';
import { env } from './utils/env.js';
import { getAllContacts, getContactById } from './services/contact.js';

const port = env('PORT', '3000');

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();

      if (contacts.length === 0) {
        res.status(404).json({
          status: 404,
          message: 'Contacts not found',
        });
        return;
      }

      res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const contact = await getContactById(contactId);

      if (!contact) {
        res.status(404).json({
          status: 404,
          message: 'Contact not found',
        });
        return;
      }
      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  });

  app.use((req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
    next();
  });

  app.listen(port, () => console.log(`Server is running on port ${port}`));
};
