import { useGetOne } from "react-admin";
import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import ProfileCard from "../../common/cards/ProfileCard";
import PostBlock from "../../common/blocks/PostBlock";
import FindUserCard from "../../common/cards/FindUserCard";
import Hero from "./Hero";
import SubBar from "./SubBar";
import { useCollection } from "@semapps/activitypub-components";

const ActorPage = () => {
  // const { username } = useParams();

  const { data: actor, isLoading } = useGetOne("Actor", {
    id: "https://framapiaf.org/users/srosset",
  });

  if (isLoading) return null;

  return (
    <>
      <Hero actor={actor} />
      <SubBar actor={actor} />
      {/* <Box marginTop={3}>
        <Container maxWidth="md">
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <PostBlock />
            </Grid>
            <Grid item xs={4}>
              <ProfileCard />
              <FindUserCard />
            </Grid>
          </Grid>
        </Container>
      </Box> */}
    </>
  );
};

export default ActorPage;
