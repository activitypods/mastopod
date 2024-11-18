import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Container, Tabs, Tab } from '@mui/material';
import { useCollection } from '@semapps/activitypub-components';
import useActorContext from '../../hooks/useActorContext';
import { useTranslate } from 'react-admin';

const SubBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState(location.pathname);
  const translate = useTranslate();

  const actor = useActorContext();
  const { totalItems: numFollowers } = useCollection(actor?.followers, { liveUpdates: true });
  const { totalItems: numFollowing } = useCollection(actor?.following, { liveUpdates: true });

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
          <Tab label={translate('app.page.posts')} sx={{ fontWeight: 'normal' }} value={`/actor/${actor.username}`} />
          <Tab
            label={translate('app.page.posts_and_replies')}
            sx={{ fontWeight: 'normal' }}
            value={`/actor/${actor.username}/replies`}
          />
          <Tab
            label={`${translate('app.page.followers')} ${numFollowers ? `(${numFollowers})` : ''}`}
            value={`/actor/${actor.username}/followers`}
            sx={{ fontWeight: 'normal' }}
          />
          <Tab
            label={`${translate('app.page.following')} ${numFollowing ? `(${numFollowing})` : ''}`}
            value={`/actor/${actor.username}/following`}
            sx={{ fontWeight: 'normal' }}
          />
        </Tabs>
      </Container>
    </AppBar>
  );
};

export default SubBar;
