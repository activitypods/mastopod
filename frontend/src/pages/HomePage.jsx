import { useEffect } from 'react';
import { Box, Button, Typography, ThemeProvider, Alert } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useGetIdentity, useTranslate, Link, useRedirect, LocalesMenuButton } from 'react-admin';
import theme from '../config/theme';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    height: '1px',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundImage: `radial-gradient(circle at 50% 14em, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`
  },
  title: {
    lineHeight: 1,
    color: 'white',
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.8em'
    }
  },
  description: {
    color: 'white',
    fontStyle: 'italic',
    paddingTop: 12,
    whiteSpace: 'pre-line',
    maxWidth: 250
  },
  link: {
    textDecoration: 'underline',
    color: 'white'
  },
  logo: {
    fontSize: 100,
    color: 'white'
  },
  button: {
    margin: 5
  }
}));

const HomePage = () => {
  const classes = useStyles();
  const redirect = useRedirect();
  const { data: identity, isLoading } = useGetIdentity();
  const translate = useTranslate();

  useEffect(() => {
    if (!isLoading && identity?.id) {
      redirect('/inbox');
    }
  }, [identity, isLoading, redirect]);

  if (isLoading) return null;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ position: 'absolute', top: 0, right: 0, p: 1, zIndex: 20 }}>
        <LocalesMenuButton />
      </Box>
      <Box className={classes.root}>
        <img src="/logo-transparent.png" style={{ width: 150 }} />
        <Typography variant="h4" className={classes.title}>
          {import.meta.env.VITE_APP_NAME}
        </Typography>
        <Typography align="center" className={classes.description}>
          {translate('app.description')}
        </Typography>

        {import.meta.env.VITE_ORGANIZATION_NAME && (
          <a
            href={import.meta.env.VITE_ORGANIZATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.link}
          >
            <Typography align="center" className={classes.description}>
              {translate('app.backed_by_organization', {
                organizationName: import.meta.env.VITE_ORGANIZATION_NAME
              })}
            </Typography>
          </a>
        )}
        <Box display="flex" pt={3} pb={3} alignItems="center">
          <Link to="/login?signup">
            <Button variant="contained" color="secondary" className={classes.button}>
              {translate('auth.action.signup')}
            </Button>
          </Link>
          &nbsp;&nbsp;
          <Link to="/login">
            <Button variant="contained" color="secondary" className={classes.button}>
              {translate('ra.auth.sign_in')}
            </Button>
          </Link>
        </Box>
        <Alert variant="filled" severity="warning" sx={{ ml: 3, mr: 3, maxWidth: 350 }}>
          {translate('app.message.early_dev_warning')}{' '}
          <a href="https://github.com/assemblee-virtuelle/mastopod/issues" target="_blank" style={{ color: 'white' }}>
            GitHub
          </a>
        </Alert>
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;
