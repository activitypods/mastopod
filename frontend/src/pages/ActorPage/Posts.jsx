import { useCollection } from '@semapps/activitypub-components';
import ActivityBlock from '../../common/blocks/ActivityBlock/ActivityBlock';
import useActorContext from '../../hooks/useActorContext';
import LoadMore from '../../common/LoadMore';

const Posts = () => {
  const actor = useActorContext();
  const {
    items: activities,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useCollection(actor?.outbox, { liveUpdates: true });
  return (
    <>
      {activities?.map(activity => (
        <ActivityBlock activity={activity} showReplies={false} key={activity.id} />
      ))}
      {hasNextPage && <LoadMore fetchNextPage={fetchNextPage} isFetchingNextPage={isFetchingNextPage} />}
    </>
  );
};

export default Posts;
