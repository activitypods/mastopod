import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import StickyBox from "react-sticky-box";
import { Box, Container, Grid } from "@mui/material";
import { useWebfinger } from "@semapps/activitypub-components";
import useActor from "../../hooks/useActor";
import ActorContext from "../../contexts/ActorContext";
import ProfileCard from "../../common/cards/ProfileCard";
import Hero from "./Hero";
import SubBar from "./SubBar";

const ActorPage = () => {
  const { username } = useParams();
  const [actorUri, setActorUri] = useState();
  const webfinger = useWebfinger();

  useEffect(() => {
    (async () => {
      const actorUri = await webfinger.fetch(username);
      setActorUri(actorUri);
    })();
  }, [webfinger, username, setActorUri]);

  const actor = useActor(actorUri);

  if (!actor.name) return null;

  return (
    <ActorContext.Provider value={actor}>
      <Hero />
      <SubBar />
      <Box marginTop={3}>
        <Container maxWidth="md">
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <Outlet />
            </Grid>
            <Grid item xs={4}>
              <StickyBox offsetTop={24}>
                <ProfileCard />
              </StickyBox>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ActorContext.Provider>
  );
};

export default ActorPage;
