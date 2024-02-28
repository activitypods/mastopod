import { useState } from "react";
import { AppBar, Container, Tabs, Tab } from "@mui/material";

const SubBar = () => {
  const [tab, setTab] = useState(0);
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
          onChange={(_, v) => setTab(v)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Inbox" sx={{ fontWeight: "normal" }} />
          <Tab label="Outbox" sx={{ fontWeight: "normal" }} />
          <Tab label="Followers" sx={{ fontWeight: "normal" }} />
          <Tab label="Following" sx={{ fontWeight: "normal" }} />
        </Tabs>
      </Container>
    </AppBar>
  );
};

export default SubBar;
