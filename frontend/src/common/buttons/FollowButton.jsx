import { useCallback, useMemo } from 'react';
import { Button } from '@mui/material';
import { useNotify, useTranslate } from 'react-admin';
import { useOutbox, useCollection, ACTIVITY_TYPES } from '@semapps/activitypub-components';

const FollowButton = ({ actorUri, children, ...rest }) => {
  const outbox = useOutbox();
  const notify = useNotify();
  const translate = useTranslate();
  const { items: following } = useCollection('following', { liveUpdates: true });

  const isFollowing = useMemo(() => following?.includes(actorUri), [following, actorUri]);

  const follow = useCallback(async () => {
    try {
      await outbox.post({
        type: ACTIVITY_TYPES.FOLLOW,
        actor: outbox.owner,
        object: actorUri,
        to: actorUri
      });
      notify('app.notification.actor_followed', { type: 'success' });
    } catch (e) {
      notify(e.message, { type: 'error' });
    }
  }, [actorUri, outbox, notify]);

  const unfollow = useCallback(async () => {
    try {
      await outbox.post({
        type: ACTIVITY_TYPES.UNDO,
        actor: outbox.owner,
        object: {
          type: ACTIVITY_TYPES.FOLLOW,
          object: actorUri
        },
        to: actorUri
      });
      notify('app.notification.actor_unfollowed', { type: 'success' });
    } catch (e) {
      notify(e.message, { type: 'error' });
    }
  }, [actorUri, outbox, notify]);

  return (
    <Button variant="contained" onClick={isFollowing ? unfollow : follow} {...rest}>
      {translate(isFollowing ? 'app.action.unfollow' : 'app.action.follow')}
    </Button>
  );
};

export default FollowButton;
