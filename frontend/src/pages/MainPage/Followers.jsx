import { Card, List, CircularProgress, Box } from '@mui/material';
import { useCollection } from '@semapps/activitypub-components';
import ActorItem from './ActorItem';
import LoadMore from '../../common/LoadMore';

const Followers = () => {
  const {
    items: followers,
    fetchNextPage,
    isFetchingNextPage,
    isLoading
  } = useCollection('followers', { liveUpdates: true });
  return (
    <>
      <Card>
        <List sx={{ p: 0 }}>
          {followers?.map(actorUri => (
            <ActorItem actorUri={actorUri} key={actorUri} />
          ))}
        </List>
      </Card>
      {followers.length === 0 && isLoading && (
        <Box height={50} mt={4} mb={4} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}
      <LoadMore fetchNextPage={fetchNextPage} isLoading={isFetchingNextPage || isLoading} />
    </>
  );
};

export default Followers;
