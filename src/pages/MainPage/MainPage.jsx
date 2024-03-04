import { Grid, Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import ProfileCard from "../../common/cards/ProfileCard";
import FindUserCard from "../../common/cards/FindUserCard";
import SubBar from "./SubBar";

const MainPage = () => {
  return (
    <>
      <SubBar />
      <Box marginTop={3}>
        <Container maxWidth="md">
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <Outlet />
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

export default MainPage;
