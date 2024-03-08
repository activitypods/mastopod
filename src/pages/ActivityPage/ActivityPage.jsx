import { useGetOne } from "react-admin";
import { useParams } from "react-router-dom";
import { Box, Container, Grid } from "@mui/material";
import useActor from "../../hooks/useActor";
import ActorContext from "../../contexts/ActorContext";
import ProfileCard from "../../common/cards/ProfileCard";
import ActivityBlock from "../../common/blocks/ActivityBlock/ActivityBlock";
import ReplyBlock from "../../common/blocks/ReplyBlock";

const ActivityPage = () => {
  const { activityUri } = useParams();

  const { data: activity } = useGetOne(
    "Activity",
    { id: activityUri },
    { staleTime: Infinity }
  );

  const actor = useActor(activity?.actor);

  if (!activity) return null;

  return (
    <ActorContext.Provider value={actor}>
      <Box marginTop={3}>
        <Container maxWidth="md">
          <Grid container spacing={3}>
            <Grid item xs={8}>
              {activity?.object?.inReplyTo && (
                <ReplyBlock activityUri={activity.object.inReplyTo} />
              )}
              <ActivityBlock activity={activity} showReplies={true} />
            </Grid>
            <Grid item xs={4}>
              <ProfileCard />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ActorContext.Provider>
  );
};

export default ActivityPage;
