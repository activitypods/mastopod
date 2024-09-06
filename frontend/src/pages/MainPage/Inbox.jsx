import { useCollection } from '@semapps/activitypub-components';
import { useCheckAuthenticated } from '@semapps/auth-provider';
import ActivityBlock from '../../common/blocks/ActivityBlock/ActivityBlock';
import PostBlock from '../../common/blocks/PostBlock';
import LoadMore from '../../common/LoadMore';

const Inbox = () => {
  useCheckAuthenticated();
  const {
    items: activities,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useCollection('inbox', { liveUpdates: true });
  return (
    <>
      <PostBlock />
      {activities?.map(activity => (
        <ActivityBlock activity={activity} key={activity.id} />
      ))}
      {hasNextPage && <LoadMore fetchNextPage={fetchNextPage} isFetchingNextPage={isFetchingNextPage} />}
    </>
  );
};

export default Inbox;