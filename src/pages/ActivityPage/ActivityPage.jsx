import { useGetOne } from "react-admin";
import { useSearchParams } from "react-router-dom";
import { Box, Container, Grid } from "@mui/material";
import useActor from "../../hooks/useActor";
import ActorContext from "../../contexts/ActorContext";
import ProfileCard from "../../common/cards/ProfileCard";
import SubBar from "../MainPage/SubBar";
import ActivityBlock from "../../common/blocks/ActivityBlock/ActivityBlock";

const ActivityPage = () => {
  const [searchParams] = useSearchParams();
  const activityUri = searchParams.get("uri");

  const { data: activity } = useGetOne(
    "Activity",
    { id: activityUri },
    { staleTime: Infinity }
  );

  const actor = useActor(activity?.actor);

  if (!activity) return null;

  return (
    <ActorContext.Provider value={actor}>
      <SubBar />
      <Box marginTop={3}>
        <Container maxWidth="md">
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <ActivityBlock activity={activity} showReplies={false} />
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
