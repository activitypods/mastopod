import { Box, Card, Typography, Avatar, Skeleton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import useActorContext from '../../hooks/useActorContext';
import FollowButton from '../buttons/FollowButton';
import EditProfileButton from '../buttons/EditProfileButton';

const useStyles = makeStyles(theme => ({
  title: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundImage: `radial-gradient(circle at 50% 14em, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    color: theme.palette.primary.contrastText,
    height: 85,
    position: 'relative'
  },
  avatarWrapper: {
    position: 'absolute',
    margin: 10,
    top: 0,
    left: 0,
    right: 0,
    textAlign: 'center'
  },
  block: {
    backgroundColor: 'white',
    paddingTop: 80,
    paddingBottom: 20
  },
  button: {
    backgroundColor: 'white',
    textAlign: 'center',
    '& a': {
      textDecoration: 'none'
    }
  },
  status: {
    marginTop: 8,
    color: theme.palette.primary.main
  }
}));

const ProfileCard = () => {
  const classes = useStyles();
  const actor = useActorContext();

  return (
    <Card>
      <Box className={classes.title}>
        <Box display="flex" justifyContent="center" className={classes.avatarWrapper}>
          {actor.isLoading ? (
            <Skeleton variant="circular" width={150} height={150} />
          ) : (
            <Avatar src={actor?.image} alt={actor?.name} sx={{ width: 150, height: 150, bgcolor: 'grey' }} />
          )}
        </Box>
      </Box>
      <Box className={classes.block}>
        {actor.isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Typography variant="h4" align="center">
            {actor?.name}
          </Typography>
        )}
        <Typography
          align="center"
          sx={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            pl: 3,
            pr: 3
          }}
        >
          {actor?.username}
        </Typography>
      </Box>
      <Box className={classes.button} pb={3} pr={3} pl={3}>
        {actor.isLoggedUser ? (
          <EditProfileButton color="secondary" />
        ) : (
          <FollowButton color="secondary" actorUri={actor?.uri} />
        )}
      </Box>
    </Card>
  );
};

export default ProfileCard;
