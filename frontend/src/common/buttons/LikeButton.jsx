import { useCallback, useMemo } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useNotify, useTranslate } from 'react-admin';
import { useOutbox, useCollection, ACTIVITY_TYPES } from '@semapps/activitypub-components';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

const LikeButton = ({ activity, object, ...rest }) => {
  const outbox = useOutbox();
  const notify = useNotify();
  const translate = useTranslate();
  const { items: liked } = useCollection('liked', { liveUpdates: true });

  const isLiked = useMemo(() => liked.includes(object?.id) || liked.includes(activity?.id), [liked, object, activity]);

  const like = useCallback(async () => {
    try {
      await outbox.post({
        type: ACTIVITY_TYPES.LIKE,
        actor: outbox.owner,
        object: object?.id || activity?.id,
        to: activity?.actor || object?.attributedTo
      });
      notify('app.notification.post_liked', { type: 'success' });
    } catch (e) {
      notify(e.message, 'error');
    }
  }, [isLiked, activity, object, outbox, notify]);

  const undoLike = useCallback(async () => {
    try {
      await outbox.post({
        type: ACTIVITY_TYPES.UNDO,
        actor: outbox.owner,
        object: {
          type: ACTIVITY_TYPES.LIKE,
          object: object?.id || activity?.id
        },
        to: activity?.actor || object?.attributedTo
      });
      notify('app.notification.post_like_removed', { type: 'success' });
    } catch (e) {
      notify(e.message, 'error');
    }
  }, [activity, object, outbox, notify]);

  return (
    <Tooltip title={translate('app.action.like')}>
      <IconButton aria-label={translate('app.action.like')} onClick={isLiked ? undoLike : like} {...rest}>
        {isLiked ? <StarIcon /> : <StarBorderIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default LikeButton;
