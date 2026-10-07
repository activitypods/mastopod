import { OBJECT_TYPES } from "@semapps/activitypub-components";
import Article from "./common/blocks/ActivityBlock/Article";
import Event from "./common/blocks/ActivityBlock/Event";
import Note from "./common/blocks/ActivityBlock/Note";
import Video from "./common/blocks/ActivityBlock/Video";

/**
 * Format the username from an actor's URI into a webfinger
 * Trims potential trailing slashes in the URI and takes the last part of the path as username
 * Then trims potential leading @ from the username
 *
 * @param {string} uri The actor's URI
 * @returns {string} The actor's webfinger
 */
export const formatUsername = (uri) => {
  const url = new URL(uri);
  const username = url.pathname.replace(/\/+$/, '').split("/").slice(-1)[0].replace(/^@+/, '');
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

export const getComponentForObject = (objectUri, boostedObject) => {
  const componentMapping = {
    [OBJECT_TYPES.NOTE]: { Component: Note, props: { noteUri: objectUri } },
    [OBJECT_TYPES.VIDEO]: { Component: Video, props: { videoUri: objectUri } },
    [OBJECT_TYPES.ARTICLE]: { Component: Article, props: { articleUri: objectUri } },
    [OBJECT_TYPES.EVENT]: { Component: Event, props: { eventUri: objectUri } },
  };

  const config = componentMapping[boostedObject.type];
  return config;
};
