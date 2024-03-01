import { Grid, Box, Container } from "@mui/material";
import { useCollection } from "@semapps/activitypub-components";
import ActivityBlock from "../../common/blocks/ActivityBlock/ActivityBlock";
import ProfileCard from "../../common/cards/ProfileCard";
import PostBlock from "../../common/blocks/PostBlock";
import FindUserCard from "../../common/cards/FindUserCard";
import SubBar from "./SubBar";

const InboxPage = () => {
  const { items: activities } = useCollection("outbox");

  return (
    <>
      <SubBar />
      <Box marginTop={3}>
        <Container maxWidth="md">
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <PostBlock />
              {activities?.map((activity) => (
                <ActivityBlock activity={activity} key={activity.id} />
              ))}
            </Grid>
            <Grid item xs={4}>
              <ProfileCard />
              <FindUserCard />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default InboxPage;
