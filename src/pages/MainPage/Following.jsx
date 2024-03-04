import { Card, List } from "@mui/material";
import { useCollection } from "@semapps/activitypub-components";
import ActorItem from "./ActorItem";

const Following = () => {
  const { items: following } = useCollection("following");
  return (
    <Card elevation={0} sx={{ mb: 3 }}>
      <List sx={{ p: 0 }}>
        {following.map((actorUri) => (
          <ActorItem actorUri={actorUri} key={actorUri} />
        ))}
      </List>
    </Card>
  );
};

export default Following;
