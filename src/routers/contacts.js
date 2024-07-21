import express from 'express';
import {
  addContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validationBody.js';
import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validation/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';

export const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(getAllContactsController));

contactsRouter.get('/:contactId', ctrlWrapper(getContactByIdController));

contactsRouter.post(
  '/',
  validateBody(contactAddSchema),
  ctrlWrapper(addContactController),
);

contactsRouter.patch(
  '/:contactId',
  validateBody(contactUpdateSchema),
  ctrlWrapper(patchContactController),
);

contactsRouter.delete('/:contactId', ctrlWrapper(deleteContactController));
