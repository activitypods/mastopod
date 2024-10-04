import { useCollection } from '@semapps/activitypub-components';
import ActivityBlock from '../../common/blocks/ActivityBlock/ActivityBlock';
import LoadMore from '../../common/LoadMore';

const Replies = ({ repliesUrl }) => {
  const {
    items: activities,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useCollection(repliesUrl, { dereferenceItems: true, liveUpdates: true });
  return (
    <>
      {activities?.map((activity, i) => (
        <ActivityBlock activity={activity} key={i} />
      ))}
      {hasNextPage && <LoadMore fetchNextPage={fetchNextPage} isFetchingNextPage={isFetchingNextPage} />}
    </>
  );
};

export default Replies;
