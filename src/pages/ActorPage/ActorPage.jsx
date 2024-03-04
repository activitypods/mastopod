import { useEffect, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { Box, Container, Grid } from "@mui/material";
import { useWebfinger } from "@semapps/activitypub-components";
import Hero from "./Hero";
import SubBar from "./SubBar";
import useActor from "../../hooks/useActor";
import ActorContext from "../../contexts/ActorContext";

const ActorPage = () => {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");
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
            <Grid item xs={4}></Grid>
          </Grid>
        </Container>
      </Box>
    </ActorContext.Provider>
  );
};

export default ActorPage;
