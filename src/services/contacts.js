import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({ page, perPage, sortBy, sortOrder }) => {
  const skip = (page - 1) * perPage;
  const totalItems = await ContactsCollection.countDocuments();
  const data = await ContactsCollection.find()
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  const { totalPages, hasNextPage, hasPrevPage } = calculatePaginationData({
    totalItems,
    page,
    perPage,
  });

  return {
    data,
    page,
    perPage,
    sortBy,
    sortOrder,
    totalItems,
    totalPages,
    hasPrevPage,
    hasNextPage,
  };
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const addContact = async (cont) => {
  const contact = await ContactsCollection.create(cont);
  return contact;
};

export const updateContact = async (filter, data, options = {}) => {
  const result = await ContactsCollection.findOneAndUpdate(filter, data, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });
  if (!result || !result.value) return null;
  const isNew = Boolean(result?.lastErrorObject?.upserted);
  return {
    data: result.value,
    isNew,
  };
};

export const deleteContact = (filter) =>
  ContactsCollection.findOneAndDelete(filter);
