import { useCollection } from '@semapps/activitypub-components';
import ActivityBlock from '../../common/blocks/ActivityBlock/ActivityBlock';
import useActorContext from '../../hooks/useActorContext';
import LoadMore from '../../common/LoadMore';

const PostsAndReplies = () => {
  const actor = useActorContext();
  const {
    items: activities,
    fetchNextPage,
    isFetchingNextPage,
    isLoading
  } = useCollection(actor?.outbox, { dereferenceItems: true });
  return (
    <>
      {activities?.map(activity => (
        <ActivityBlock activity={activity} showReplies={true} key={activity.id} />
      ))}
      <LoadMore fetchNextPage={fetchNextPage} isLoading={isFetchingNextPage || isLoading} />
    </>
  );
};

export default PostsAndReplies;
