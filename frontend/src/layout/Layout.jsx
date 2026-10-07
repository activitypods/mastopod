import { useEffect } from 'react';
import { Box } from '@mui/material';
import { BackgroundChecks, SyncUserLocale } from '@activitypods/react';
import AppBar from './AppBar';

const Layout = ({ children }) => {
  // @activitypods/react 2.2.0 saves the current path before sending the user to the authorization
  // agent, and BackgroundChecks redirects there on every navigation without ever removing it, which
  // sends the user back to the same page all the time. Remove it once BackgroundChecks has used it
  // (a parent's effects run after its children's). Fixed upstream in activitypods e615567.
  useEffect(() => {
    localStorage.removeItem('redirect');
  }, []);

  return (
    <BackgroundChecks clientId={import.meta.env.VITE_BACKEND_CLIENT_ID}>
      <SyncUserLocale />
      <Box minHeight="100vh">
        <AppBar />
        {children}
      </Box>
    </BackgroundChecks>
  );
};

export default Layout;
