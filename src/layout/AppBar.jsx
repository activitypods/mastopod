import {
  AppBar as MuiAppBar,
  IconButton,
  Toolbar,
  Container,
  Typography,
} from "@mui/material";
import { UserMenu } from "@semapps/auth-provider";
import { Link } from "react-router-dom";
import AppIcon from "../config/AppIcon";

const AppBar = () => (
  <MuiAppBar position="static" sx={{ flexGrow: 1 }} elevation={0}>
    <Container maxWidth="md">
      <Toolbar disableGutters>
        <Link to="/inbox">
          <IconButton
            edge="start"
            color="inherit"
            sx={{ color: "white", ml: 0 }}
          >
            <AppIcon fontSize="large" />
          </IconButton>
        </Link>
        <Typography
          variant="h4"
          sx={{
            flexGrow: 1,
            marginLeft: 1,
            "& a": {
              color: "white",
              textDecoration: "none",
            },
          }}
        >
          <Link to="/inbox">Mastopod</Link>
        </Typography>
        <UserMenu />
      </Toolbar>
    </Container>
  </MuiAppBar>
);

export default AppBar;
