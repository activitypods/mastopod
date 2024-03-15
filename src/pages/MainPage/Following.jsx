import { Card, List } from "@mui/material";
import { useCollection } from "@semapps/activitypub-components";
import ActorItem from "./ActorItem";
import LoadMore from "../../common/LoadMore";

const Following = () => {
  const {
    items: following,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useCollection("following");
  return (
    <>
      <Card>
        <List sx={{ p: 0 }}>
          {following?.map((actorUri) => (
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

export default Following;
