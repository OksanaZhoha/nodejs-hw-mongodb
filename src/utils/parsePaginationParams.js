const normalizeParams = (value, defaultValue) => {
  if (typeof value !== 'string') {
    return defaultValue;
  }
  const parsedValue = parseInt(value);
  if (Number.isNaN(parsedValue)) {
    return defaultValue;
  }
  return parsedValue;
};

export const parsePaginationParams = ({ page, perPage }) => {
  const parsedPage = normalizeParams(page, 1);
  const parsedPerPage = normalizeParams(perPage, 10);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
