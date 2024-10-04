import { Link } from 'react-router-dom';
import { AppBar as MuiAppBar, Toolbar, Container, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { UserMenu } from '@activitypods/react';

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundImage: `radial-gradient(circle at 50% 8em, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`
  },
  logo: {
    position: 'relative',
    top: 3,
    width: 42,
    marginRight: 5
  }
}));

const AppBar = () => {
  const classes = useStyles();
  return (
    <MuiAppBar position="static" sx={{ flexGrow: 1 }} elevation={0} className={classes.appBar}>
      <Container maxWidth="md">
        <Toolbar disableGutters>
          <Link to="/inbox">
            <img src="/logo-transparent.png" className={classes.logo} />
          </Link>
          <Typography
            variant="h4"
            sx={{
              flexGrow: 1,
              marginLeft: 1,
              '& a': {
                color: 'white',
                textDecoration: 'none'
              }
            }}
          >
            <Link to="/inbox">Mastopod</Link>
          </Typography>
          <UserMenu />
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
};

export default AppBar;
