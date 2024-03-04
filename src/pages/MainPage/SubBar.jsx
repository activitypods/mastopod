import { useState } from "react";
import { AppBar, Container, Tabs, Tab } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const SubBar = () => {
  const location = useLocation();
  const [tab, setTab] = useState(location.pathname);
  const navigate = useNavigate();

  const onChange = (_, v) => {
    navigate(v);
    setTab(v);
  };

  return (
    <AppBar
      position="relative"
      sx={{
        backgroundColor: "#D4D4D4",
        boxShadow: "none",
        zIndex: 900,
      }}
    >
      <Container maxWidth="md">
        <Tabs
          value={tab}
          onChange={onChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Inbox" value="/inbox" sx={{ fontWeight: "normal" }} />
          <Tab label="Outbox" value="/outbox" sx={{ fontWeight: "normal" }} />
          <Tab
            label="Followers"
            value="/followers"
            sx={{ fontWeight: "normal" }}
          />
          <Tab
            label="Following"
            value="/following"
            sx={{ fontWeight: "normal" }}
          />
        </Tabs>
      </Container>
    </AppBar>
  );
};

export default SubBar;
