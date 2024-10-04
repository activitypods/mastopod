import { Box, Container, Avatar, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import FollowButton from "../../common/buttons/FollowButton";
import useActorContext from "../../hooks/useActorContext";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "white",
    paddingTop: 25,
    paddingBottom: 25,
    [theme.breakpoints.down("sm")]: {
      paddingTop: 20,
      paddingBottom: 20,
      marginBottom: 0,
    },
  },
  container: {
    position: "relative",
    paddingLeft: 130,
    paddingTop: 15,
    height: 100,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 100,
      paddingTop: 10,
      height: 110,
    },
  },
}));

const Hero = () => {
  const classes = useStyles();
  const actor = useActorContext();

  return (
    <Box className={classes.root}>
      <Container maxWidth="md">
        <Box className={classes.container}>
          <Avatar
            src={actor?.image}
            alt={actor?.name}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: {
                xs: 80,
                sm: 100,
              },
              height: {
                xs: 80,
                sm: 100,
              },
            }}
          />
          <Typography
            variant="h3"
            sx={{ lineHeight: 1.15, fontSize: { xs: 24, sm: 40 } }}
          >
            {actor?.name}
          </Typography>
          {actor && (
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              {actor?.username}
            </Typography>
          )}
          <FollowButton
            actorUri={actor.uri}
            color="secondary"
            sx={{ position: "absolute", bottom: 0, right: 0 }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
