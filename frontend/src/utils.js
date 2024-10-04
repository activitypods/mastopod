export const formatUsername = (uri) => {
  const url = new URL(uri);
  const username = url.pathname.split("/").slice(-1);
  return `@${username}@${url.host}`;
};

export const arrayOf = (value) => {
  // If the field is null-ish, we suppose there are no values.
  if (value === null || value === undefined) {
    return [];
  }
  // Return as is.
  if (Array.isArray(value)) {
    return value;
  }
  // Single value is made an array.
  return [value];
};
