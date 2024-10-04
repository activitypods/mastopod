import { CircularProgress, Box } from '@mui/material';
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
    isFetchingNextPage,
    isLoading
  } = useCollection('inbox', { liveUpdates: true, dereferenceItems: true });
  return (
    <>
      <PostBlock />
      {activities?.map(activity => (
        <ActivityBlock activity={activity} key={activity.id} />
      ))}
      {activities.length === 0 && isLoading && (
        <Box height={50} mt={4} mb={4} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}
      {hasNextPage && <LoadMore fetchNextPage={fetchNextPage} isLoading={isFetchingNextPage || isLoading} />}
    </>
  );
};

export default Inbox;
