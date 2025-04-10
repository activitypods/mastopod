import { Box, Avatar, Typography } from '@mui/material';
import { Link, useTranslate } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import LikeButton from '../../buttons/LikeButton';
import BoostButton from '../../buttons/BoostButton';
import ReplyButton from '../../buttons/ReplyButton';
import RelativeDate from '../../RelativeDate';
import useActor from '../../../hooks/useActor';
import { useCollection } from '@semapps/activitypub-components';
import MoreButton from '../../buttons/MoreButton';
import { MenuItem } from '@mui/material';

/**
 * BaseActivityBlock - A container component for activity blocks
 * 
 * This component provides the common structure for all activity blocks:
 * - Avatar and author information
 * - Action buttons (reply, like, boost)
 * - A container for the specific content of each activity type
 * 
 * @param {Object} props
 * @param {Object} props.object - The activity object
 * @param {Object} props.activity - The activity data
 * @param {string} props.objectUri - The URI of the object
 * @param {string} props.actorUri - The URI of the actor
 * @param {React.ReactNode} props.children - The content to render inside the block
 */
const BaseActivityBlock = ({ object, activity, objectUri, actorUri, children }) => {
  const navigate = useNavigate();
  const translate = useTranslate();
  const actor = useActor(actorUri);

  // Extract collection URIs
  const repliesUri = object?.replies?.id || object?.replies;
  const likesUri = object?.likes?.id || object?.likes;
  const sharesUri = object?.shares?.id || object?.shares;

  // Fetch collection data
  const { totalItems: numReplies } = useCollection(
    repliesUri,
    { dereferenceItems: false, liveUpdates: true, enabled: !!repliesUri }
  );

  const { totalItems: numLikes } = useCollection(
    likesUri,
    { dereferenceItems: false, liveUpdates: true, enabled: !!likesUri }
  );

  const { totalItems: numShares, items: shares } = useCollection(
    sharesUri,
    { dereferenceItems: false, liveUpdates: true, enabled: !!sharesUri }
  );

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Author information */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Link to={`/actor/${actor?.username}`}>
          <Avatar
            src={actor?.image}
            alt={actor?.name}
            sx={{
              width: 50,
              height: 50,
              mr: 2
            }}
          />
        </Link>
        <Box sx={{ flex: 1 }}>
          <Link to={`/actor/${actor?.username}`}>
            <Typography
              sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                color: 'black',
                pr: 8
              }}
            >
              <strong>{actor?.name}</strong>{' '}
              <Typography component="span" sx={{ color: 'grey' }}>
                <em>{actor?.username}</em>
              </Typography>
            </Typography>
          </Link>
          {object?.published && (
            <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
              <RelativeDate date={object?.published} sx={{ fontSize: 13, color: 'grey' }} />
            </Box>
          )}
        </Box>
      </Box>

      {/* Content area - rendered by child components */}
      <Box sx={{ pl: 0 }}>
        {children}
      </Box>

      {/* Action buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <ReplyButton objectUri={objectUri} numReplies={numReplies} />
        <BoostButton activity={activity} object={object} numBoosts={numShares} shares={shares} />
        <LikeButton activity={activity} object={object} numlikes={numLikes} />
        <MoreButton>
          <MenuItem onClick={event => console.log('event', event)}>{translate('app.action.unfollow')}</MenuItem>
        </MoreButton>
      </Box>
    </Box>
  );
};

export default BaseActivityBlock; 