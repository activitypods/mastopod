import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppBar, Container, Tabs, Tab } from "@mui/material";
import { useCollection } from "@semapps/activitypub-components";
import useActorContext from "../../hooks/useActorContext";

const SubBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState(location.pathname);

  const actor = useActorContext();
  const { totalItems: numFollowers } = useCollection(actor?.followers);
  const { totalItems: numFollowing } = useCollection(actor?.following);

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
          <Tab
            label="Posts"
            sx={{ fontWeight: "normal" }}
            value={`/actor/${actor.username}`}
          />
          <Tab
            label="Posts & Replies"
            sx={{ fontWeight: "normal" }}
            value={`/actor/${actor.username}/replies`}
          />
          <Tab
            label={`Followers ${numFollowers ? `(${numFollowers})` : ""}`}
            value={`/actor/${actor.username}/followers`}
            sx={{ fontWeight: "normal" }}
          />
          <Tab
            label={`Following ${numFollowing ? `(${numFollowing})` : ""}`}
            value={`/actor/${actor.username}/following`}
            sx={{ fontWeight: "normal" }}
          />
        </Tabs>
      </Container>
    </AppBar>
  );
};

export default SubBar;
