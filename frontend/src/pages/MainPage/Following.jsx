import { Card, List, CircularProgress, Box } from '@mui/material';
import { useCollection } from '@semapps/activitypub-components';
import ActorItem from './ActorItem';
import LoadMore from '../../common/LoadMore';

const Following = () => {
  const {
    items: following,
    fetchNextPage,
    isFetchingNextPage,
    isLoading
  } = useCollection('following', { liveUpdates: true });
  return (
    <>
      <Card>
        <List sx={{ p: 0 }}>
          {following?.map(actorUri => (
            <ActorItem actorUri={actorUri} key={actorUri} unfollowButton />
          ))}
        </List>
      </Card>
      {following.length === 0 && isLoading && (
        <Box height={50} mt={4} mb={4} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}
      <LoadMore fetchNextPage={fetchNextPage} isLoading={isFetchingNextPage || isLoading} />
    </>
  );
};

export default Following;
