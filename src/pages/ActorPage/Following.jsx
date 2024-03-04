import { Card, List, Typography } from "@mui/material";
import { useCollection } from "@semapps/activitypub-components";
import useActorContext from "../../hooks/useActorContext";
import ActorItem from "../MainPage/ActorItem";

const Following = () => {
  const actor = useActorContext();
  const {
    items: following,
    totalItems,
    isLoading,
  } = useCollection(actor?.following);
  return (
    <Card elevation={0} sx={{ mb: 3 }}>
      <List sx={{ p: 0 }}>
        {following.map((actorUri) => (
          <ActorItem actorUri={actorUri} key={actorUri} />
        ))}
      </List>
      {totalItems > 0 && following.length === 0 && !isLoading && (
        <Typography>
          This user has chosen to not make this information available
        </Typography>
      )}
    </Card>
  );
};

export default Following;
