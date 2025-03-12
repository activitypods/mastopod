import { useCollection } from '@semapps/activitypub-components';
import { useCheckAuthenticated } from '@semapps/auth-provider';
import ActivityBlock from '../../common/blocks/ActivityBlock/ActivityBlock';
import PostBlock from '../../common/blocks/PostBlock';
import LoadMore from '../../common/LoadMore';

const Outbox = () => {
  useCheckAuthenticated();
  const {
    items: activities,
    fetchNextPage,
    isFetchingNextPage,
    isLoading
  } = useCollection('outbox', { liveUpdates: true, dereferenceItems: true });
  return (
    <>
      <PostBlock />
      {activities?.map(activity => (
        <ActivityBlock activity={activity} key={activity.id} showReplies />
      ))}
      <LoadMore fetchNextPage={fetchNextPage} isLoading={isFetchingNextPage || isLoading} />
    </>
  );
};

export default Outbox;
