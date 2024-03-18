import { Grid, Box, Container } from "@mui/material";
import { useGetIdentity } from "react-admin";
import { Outlet } from "react-router-dom";
import StickyBox from "react-sticky-box";
import ProfileCard from "../../common/cards/ProfileCard";
import FindUserCard from "../../common/cards/FindUserCard";
import SubBar from "./SubBar";
import useActor from "../../hooks/useActor";
import ActorContext from "../../contexts/ActorContext";

const MainPage = () => {
  const { data: identity } = useGetIdentity();
  const actor = useActor(identity?.id);
  return (
    <ActorContext.Provider value={actor}>
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
                <FindUserCard />
              </StickyBox>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ActorContext.Provider>
  );
};

export default MainPage;
