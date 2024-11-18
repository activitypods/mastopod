import { Box } from '@mui/material';
import { BackgroundChecks, SyncUserLocale } from '@activitypods/react';
import AppBar from './AppBar';

const Layout = ({ children }) => (
  <BackgroundChecks clientId={import.meta.env.VITE_BACKEND_CLIENT_ID}>
    <SyncUserLocale />
    <Box minHeight="100vh">
      <AppBar />
      {children}
    </Box>
  </BackgroundChecks>
);

export default Layout;
