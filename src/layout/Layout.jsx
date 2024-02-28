import { Box } from "@mui/material";
import AppBar from "./AppBar";

const Layout = ({ children }) => (
  <Box minHeight="100vh">
    <AppBar />
    {children}
  </Box>
);

export default Layout;
