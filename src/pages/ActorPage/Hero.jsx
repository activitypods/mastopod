import { Box, Container, Avatar, Typography, Hidden } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { formatUsername } from "../../utils";

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
}));

const Hero = ({ actor }) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Container maxWidth="md">
        <Box className={classes.container}>
          <Avatar
            src={actor?.icon?.url}
            alt={actor?.name}
            className={classes.avatar}
          />
          <Typography variant="h3" className={classes.title}>
            {actor?.name}
          </Typography>
          {actor && (
            <Typography variant="body2" className={classes.username}>
              {formatUsername(actor?.id)}
            </Typography>
          )}
          <Hidden xsDown>
            <Typography variant="body2" className={classes.note}>
              {actor?.summary}
            </Typography>
          </Hidden>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
