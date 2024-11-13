import { useState } from 'react';
import { AppBar, Container, Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCollection } from '@semapps/activitypub-components';
import { useTranslate } from 'react-admin';

const SubBar = () => {
  const location = useLocation();
  const [tab, setTab] = useState(location.pathname);
  const navigate = useNavigate();
  const translate = useTranslate();

  const { totalItems: numFollowers } = useCollection('followers', { liveUpdates: true });
  const { totalItems: numFollowing } = useCollection('following', { liveUpdates: true });

  const onChange = (_, v) => {
    navigate(v);
    setTab(v);
  };

  return (
    <AppBar
      position="relative"
      sx={{
        backgroundColor: '#D4D4D4',
        boxShadow: 'none',
        zIndex: 900
      }}
    >
      <Container maxWidth="md">
        <Tabs value={tab} onChange={onChange} indicatorColor="primary" textColor="primary">
          <Tab label={translate('app.page.my_inbox')} value="/inbox" sx={{ fontWeight: 'normal' }} />
          <Tab label={translate('app.page.my_outbox')} value="/outbox" sx={{ fontWeight: 'normal' }} />
          <Tab
            label={`${translate('app.page.followers')} ${numFollowers ? `(${numFollowers})` : ''}`}
            value="/followers"
            sx={{ fontWeight: 'normal' }}
          />
          <Tab
            label={`${translate('app.page.following')} ${numFollowing ? `(${numFollowing})` : ''}`}
            value="/following"
            sx={{ fontWeight: 'normal' }}
          />
        </Tabs>
      </Container>
    </AppBar>
  );
};

export default SubBar;
