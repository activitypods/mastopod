export const formatUsername = (uri) => {
  const url = new URL(uri);
  const username = url.pathname.split("/").slice(-1);
  return `@${username}@${url.host}`;
};
