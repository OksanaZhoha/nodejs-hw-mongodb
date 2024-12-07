import { sortOrderList } from '../constans/sortList.js';

export const parseSortParams = ({ sortBy, sortOrder }, fieldList) => {
  console.log(sortBy, sortOrder);
  const parsedSortOrder = sortOrderList.includes(sortOrder)
    ? sortOrder
    : sortOrderList[0];
  console.log(parsedSortOrder);
  const parsedSortBy = fieldList.includes(sortBy) ? sortBy : fieldList[1];

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
