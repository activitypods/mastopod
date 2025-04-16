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
 * @param {object} props
 * @param {object} props.object - The activity object
 * @param {object} props.activity - The activity data
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
    <>
      {/* Author information */}
      <Box pl={8} sx={{ position: 'relative' }}>
        <Link to={`/actor/${actor?.username}`}>
          <Avatar
            src={actor?.image}
            alt={actor?.name}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 50,
              height: 50
            }}
          />
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
        {children}
      </Box>
      {/* Action buttons */}
      <Box pl={8} pt={2} display="flex" justifyContent="space-between">
        <ReplyButton objectUri={objectUri} numReplies={numReplies} />
        <BoostButton activity={activity} object={object} numBoosts={numShares} shares={shares} />
        <LikeButton activity={activity} object={object} numlikes={numLikes} />
        <MoreButton>
          <MenuItem onClick={event => console.log('event', event)}>{translate('app.action.unfollow')}</MenuItem>
        </MoreButton>
      </Box>
    </>
  );
};

export default BaseActivityBlock; 