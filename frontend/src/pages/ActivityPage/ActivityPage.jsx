import { useGetOne } from "react-admin";
import { useParams } from "react-router-dom";
import StickyBox from "react-sticky-box";
import { Box, Container, Grid, Hidden } from "@mui/material";
import useActor from "../../hooks/useActor";
import ActorContext from "../../contexts/ActorContext";
import ProfileCard from "../../common/cards/ProfileCard";
import ActivityBlock from "../../common/blocks/ActivityBlock/ActivityBlock";
import ReplyBlock from "../../common/blocks/ReplyBlock";
import Replies from "./Replies";
import PostBlock from "../../common/blocks/PostBlock";

const ActivityPage = () => {
  const { activityUri } = useParams();

  const { data: activity } = useGetOne(
    "Activity",
    { id: activityUri },
    { staleTime: Infinity }
  );

  const actor = useActor(activity?.actor || activity?.attributedTo);

  if (!activity) return null;

  return (
    <ActorContext.Provider value={actor}>
      <Box marginTop={3}>
        <Container maxWidth="md">
          <Grid container spacing={3}>
            <Grid item sm={8} xs={12}>
              {activity?.object?.inReplyTo && (
                <ReplyBlock activityUri={activity.object.inReplyTo} />
              )}
              <ActivityBlock
                activity={activity}
                showReplies={true}
                clickOnContent={false}
              />
              <PostBlock
                inReplyTo={activity.object?.id || activity.id}
                mention={actor}
              />
              <Replies
                repliesUrl={
                  activity?.object?.replies?.id ||
                  activity.object?.replies ||
                  activity.replies?.id ||
                  activity.replies
                }
              />
            </Grid>
            <Hidden smDown>
              <Grid item sm={4}>
                <StickyBox offsetTop={24}>
                  <ProfileCard />
                </StickyBox>
              </Grid>
            </Hidden>
          </Grid>
        </Container>
      </Box>
    </ActorContext.Provider>
  );
};

export default ActivityPage;
