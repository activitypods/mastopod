import { Box, Container, Grid } from "@mui/material";
import { useCollection } from "@semapps/activitypub-components";
import ActivityBlock from "../../common/blocks/ActivityBlock/ActivityBlock";

const Outbox = ({ actor }) => {
  const { items: activities } = useCollection(actor?.outbox);

  return (
    <Box marginTop={3}>
      <Container maxWidth="md">
        <Grid container spacing={3}>
          <Grid item xs={8}>
            {activities?.map((activity) => (
              <ActivityBlock activity={activity} key={activity.id} />
            ))}
          </Grid>
          <Grid item xs={4}></Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Outbox;
