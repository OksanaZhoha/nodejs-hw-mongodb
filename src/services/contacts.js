import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  contactType,
  isFavorite,
  userId,
}) => {
  const skip = (page - 1) * perPage;
  const dataBaseQuery = ContactsCollection.find();

  if (userId) {
    dataBaseQuery.where('userId').equals(userId);
  }

  if (contactType) {
    dataBaseQuery.where('contactType').equals(contactType);
  }

  if (isFavorite) {
    dataBaseQuery.where('isFavorite').equals(isFavorite);
  }

  const totalItems = await ContactsCollection.find()
    .merge(dataBaseQuery)
    .countDocuments();

  const data = await dataBaseQuery
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

export const getContact = async (filter) => {
  const contact = await ContactsCollection.findOne(filter);
  return contact;
};

export const addContact = async (cont) => {
  const contact = await ContactsCollection.create(cont);
  return contact;
};

export const updateContact = async (filter, data, options = {}) => {
  const result = await ContactsCollection.findOneAndUpdate(filter, data, {
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
