import { Card, List } from "@mui/material";
import { useCollection } from "@semapps/activitypub-components";
import ActorItem from "./ActorItem";
import LoadMore from "../../common/LoadMore";

const Followers = () => {
  const {
    items: followers,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useCollection("followers");
  return (
    <>
      <Card>
        <List sx={{ p: 0 }}>
          {followers?.map((actorUri) => (
            <ActorItem actorUri={actorUri} key={actorUri} />
          ))}
        </List>
      </Card>
      {hasNextPage && (
        <LoadMore
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </>
  );
};

export default Followers;
