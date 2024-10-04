import { Grid, Box, Container, Hidden } from "@mui/material";
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
      <Hidden smUp>
        <Box p={2}>
          <FindUserCard stripCard />
        </Box>
      </Hidden>
      <Box marginTop={{ xs: 0, sm: 3 }}>
        <Container maxWidth="md">
          <Grid container spacing={3}>
            <Grid item sm={8} xs={12}>
              <Outlet />
            </Grid>
            <Hidden smDown>
              <Grid item sm={4} xs={12}>
                <StickyBox offsetTop={24}>
                  <ProfileCard />
                  <FindUserCard />
                </StickyBox>
              </Grid>
            </Hidden>
          </Grid>
        </Container>
      </Box>
    </ActorContext.Provider>
  );
};

export default MainPage;
