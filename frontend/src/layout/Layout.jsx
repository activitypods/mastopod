import { Box } from '@mui/material';
import { BackgroundChecks } from '@activitypods/react';
import AppBar from './AppBar';

const Layout = ({ children }) => (
  <BackgroundChecks clientId={import.meta.env.VITE_BACKEND_CLIENT_ID}>
    <Box minHeight="100vh">
      <AppBar />
      {children}
    </Box>
  </BackgroundChecks>
);

export default Layout;
