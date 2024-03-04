import { useState } from "react";
import { AppBar, Container, Tabs, Tab } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SubBar = () => {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  const onChange = (_, v) => {
    switch (v) {
      case 0:
        navigate("/inbox");
        break;
      case 1:
        navigate("/outbox");
        break;
      case 2:
        navigate("/followers");
        break;
    }
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
