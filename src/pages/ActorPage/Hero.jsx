import { Box, Container, Avatar, Typography } from "@mui/material";
import { useNotify } from "react-admin";
import { useOutbox } from "@semapps/activitypub-components";
import makeStyles from "@mui/styles/makeStyles";
import { formatUsername } from "../../utils";
import FollowButton from "../../common/buttons/FollowButton";
import useActorContext from "../../hooks/useActorContext";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "white",
    paddingTop: 25,
    paddingBottom: 25,
    [theme.breakpoints.down("xs")]: {
      paddingTop: 20,
      paddingBottom: 20,
      marginBottom: 0,
      height: 100,
    },
  },
  container: {
    position: "relative",
    paddingLeft: 130,
    paddingTop: 15,
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 120,
      paddingTop: 20,
    },
  },
  title: {
    lineHeight: 1.15,
  },
  username: {
    fontStyle: "italic",
  },
  note: {
    marginTop: 10,
  },
  avatar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 100,
    height: 100,
  },
  button: {
    position: "absolute",
    bottom: 0,
    right: 0,
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
            className={classes.avatar}
          />
          <Typography variant="h3" className={classes.title}>
            {actor?.name}
          </Typography>
          {actor && (
            <Typography variant="body2" className={classes.username}>
              {actor?.username}
            </Typography>
          )}
          <FollowButton
            actorUri={actor.uri}
            color="secondary"
            className={classes.button}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
