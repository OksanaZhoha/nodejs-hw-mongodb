import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { fieldList } from '../constans/fieldList.js';

const { isValidObjectId } = mongoose;

export const getAllContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, fieldList);
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
  });

  if (contacts.length === 0) {
    next(createHttpError(404, 'Contacts not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    next(createHttpError(400, 'Invalid contact ID'));
    return;
  }

  const contact = await getContactById(contactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const addContactController = async (req, res, next) => {
  const contact = await addContact(req.body);

  if (!contact) {
    next(createHttpError(404, 'Contact not added'));
    return;
  }

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    next(createHttpError(400, 'Invalid contact ID'));
    return;
  }

  const result = await updateContact({ _id: contactId }, req.body);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    next(createHttpError(400, 'Invalid contact ID'));
    return;
  }

  const result = await deleteContact({ _id: contactId });

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).json({
    status: 204,
  });
};
