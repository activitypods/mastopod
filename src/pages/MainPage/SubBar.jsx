import { useState } from "react";
import { AppBar, Container, Tabs, Tab } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useCollection } from "@semapps/activitypub-components";

const SubBar = () => {
  const location = useLocation();
  const [tab, setTab] = useState(location.pathname);
  const navigate = useNavigate();

  const { totalItems: numFollowers } = useCollection("followers");
  const { totalItems: numFollowing } = useCollection("following");

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
          <Tab label="My Inbox" value="/inbox" sx={{ fontWeight: "normal" }} />
          <Tab
            label="My Outbox"
            value="/outbox"
            sx={{ fontWeight: "normal" }}
          />
          <Tab
            label={`Followers ${numFollowers ? `(${numFollowers})` : ""}`}
            value="/followers"
            sx={{ fontWeight: "normal" }}
          />
          <Tab
            label={`Following ${numFollowing ? `(${numFollowing})` : ""}`}
            value="/following"
            sx={{ fontWeight: "normal" }}
          />
        </Tabs>
      </Container>
    </AppBar>
  );
};

export default SubBar;
