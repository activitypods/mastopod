import { useCollection } from '@semapps/activitypub-components';

/**
 * Custom hook for handling activity collections (replies, likes, shares)
 * @param {Object} object - The object containing collection URIs
 * @returns {Object} - Collection data
 */
const useActivityCollections = (object) => {
  //Mastodon collection URI is nested
  const repliesUri = object?.replies?.id || object?.replies; 
  const likesUri = object?.likes?.id || object?.likes;
  const sharesUri = object?.shares?.id || object?.shares;

  const { totalItems: numReplies } = useCollection(
    repliesUri,
    { dereferenceItems: false, liveUpdates: true, enabled: !!repliesUri}
  );

  const { totalItems: numLikes } = useCollection(
    likesUri,
    { dereferenceItems: false, liveUpdates: true, enabled: !!likesUri}
  );
  
  const { totalItems: numShares, items: shares} = useCollection(
    sharesUri,
    { dereferenceItems: false, liveUpdates: true, enabled: !!sharesUri}
  );

  return {
    numReplies,
    numLikes,
    numShares,
    shares
  };
};

export default useActivityCollections; 