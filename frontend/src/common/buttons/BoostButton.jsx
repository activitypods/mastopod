import { useCallback, useMemo } from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import { useNotify, useGetIdentity, useTranslate } from 'react-admin';
import { useOutbox, ACTIVITY_TYPES, PUBLIC_URI } from '@semapps/activitypub-components';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOnIcon from '@mui/icons-material/RepeatOn';

const BoostButton = ({ object, activity, numBoosts, shares, ...rest }) => {
  const outbox = useOutbox();
  const notify = useNotify();
  const translate = useTranslate();
  const { data: identity } = useGetIdentity();

  const share = useMemo(() => shares.filter(share => share.startsWith(`${outbox.owner}/`))[0], [shares, outbox]);
  const isBoosted = useMemo(() => !!share, [share]);


  const boost = useCallback(async () => {
    try {
      await outbox.post({
        type: ACTIVITY_TYPES.ANNOUNCE,
        actor: outbox.owner,
        object: object?.id || activity?.id,
        to: [identity.webIdData.followers, activity?.actor || object?.attributedTo, PUBLIC_URI]
      });
      notify('app.notification.post_boosted', { type: 'success' });
    } catch (e) {
      notify(e.message, 'error');
    }
  }, [object, activity, outbox, notify]);

  const unboost = useCallback(async () => {
    try {
      const undo = {
        type: ACTIVITY_TYPES.UNDO,
        actor: outbox.owner,
        object: share,
        to: activity?.actor || object?.attributedTo
      };
      await outbox.post(undo);
      notify('app.notification.post_unboosted', { type: 'success' });
    } catch (e) {
      notify(e.message, 'error');
    }
  }, [object, activity, outbox, notify]);

  return (
    <Tooltip title={translate('app.action.boost')}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton aria-label={translate('app.action.boost')} onClick={isBoosted ? unboost : boost} {...rest}>
          {isBoosted ? <RepeatOnIcon /> : <RepeatIcon />}
        </IconButton>
        {numBoosts > 0 && (
          <Box sx={{ ml: -1, fontSize: '0.875rem', color: 'text.secondary' }}>
            {numBoosts}
        </Box>
        )}
      </Box>
    </Tooltip>
  );
};

export default BoostButton;
