import { typeList } from '../constans/contacts.js';

const parseBoolean = (value) => {
  if (typeof value !== 'string') return;

  if (!['true', 'false'].includes(value)) return;

  const parsedValue = Boolean(value);

  return parsedValue;
};

export const parseContactsFilterParams = ({ contactType, isFavorite }) => {
  const parsedType = typeList.includes(contactType) ? contactType : null;
  const parsedFavorite = parseBoolean(isFavorite);

  return {
    contactType: parsedType,
    isFavorite: parsedFavorite,
  };
};
