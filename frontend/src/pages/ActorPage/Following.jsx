import { Card, List, Typography } from '@mui/material';
import { useCollection } from '@semapps/activitypub-components';
import useActorContext from '../../hooks/useActorContext';
import ActorItem from '../MainPage/ActorItem';
import LoadMore from '../../common/LoadMore';

const Following = () => {
  const actor = useActorContext();
  const {
    items: following,
    totalItems,
    isLoading,
    fetchNextPage,
    isFetchingNextPage
  } = useCollection(actor?.following, { liveUpdates: true });
  return (
    <>
      <Card>
        <List sx={{ p: 0 }}>
          {following?.map(actorUri => (
            <ActorItem actorUri={actorUri} key={actorUri} />
          ))}
        </List>
        {totalItems > 0 && following.length === 0 && !isLoading && (
          <Typography>This user has chosen to not make this information available</Typography>
        )}
      </Card>
      <LoadMore fetchNextPage={fetchNextPage} isLoading={isFetchingNextPage || isLoading} />
    </>
  );
};

export default Following;
