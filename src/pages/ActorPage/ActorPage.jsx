import { useGetOne } from "react-admin";
import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import ProfileCard from "../../common/cards/ProfileCard";
import PostBlock from "../../common/blocks/PostBlock";
import FindUserCard from "../../common/cards/FindUserCard";
import Hero from "./Hero";
import SubBar from "./SubBar";
import { useCollection, useWebfinger } from "@semapps/activitypub-components";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Outbox from "./Outbox";

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

  const { data: actor } = useGetOne(
    "Actor",
    {
      id: actorUri,
    },
    { enabled: !!actorUri }
  );

  if (!actor) return null;

  return (
    <>
      <Hero actor={actor} />
      <SubBar actor={actor} />
      <Outbox actor={actor} />
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
