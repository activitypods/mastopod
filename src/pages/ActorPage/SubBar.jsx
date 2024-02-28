import { useState } from "react";
import { AppBar, Container, Tabs, Tab } from "@mui/material";
import { useCollection } from "@semapps/activitypub-components";

const SubBar = ({ actor }) => {
  const [tab, setTab] = useState(0);
  const { totalItems: numFollowers } = useCollection(actor?.followers);
  const { totalItems: numFollowing } = useCollection(actor?.following);

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
          <Tab label="Outbox" sx={{ fontWeight: "normal" }} />
          <Tab
            label={`Followers (${numFollowers})`}
            sx={{ fontWeight: "normal" }}
          />
          <Tab
            label={`Following (${numFollowing})`}
            sx={{ fontWeight: "normal" }}
          />
        </Tabs>
      </Container>
    </AppBar>
  );
};

export default SubBar;
