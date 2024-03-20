import { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import StickyBox from "react-sticky-box";
import { Box, Container, Grid, Hidden } from "@mui/material";
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
      if (username.startsWith("http")) {
        // Allow to use the full URI for the username
        setActorUri(username);
      } else {
        const actorUri = await webfinger.fetch(username);
        setActorUri(actorUri);
      }
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
            <Grid item sm={8} xs={12}>
              <Outlet />
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

export default ActorPage;
