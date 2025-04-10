import { useMemo } from 'react';
import isObject from 'isobject';
import { Box, Avatar, Typography, MenuItem } from '@mui/material';
import { Link, useTranslate } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import LikeButton from '../../buttons/LikeButton';
import BoostButton from '../../buttons/BoostButton';
import ReplyButton from '../../buttons/ReplyButton';
import RelativeDate from '../../RelativeDate';
import useActor from '../../../hooks/useActor';
import { arrayOf } from '../../../utils';
import MoreButton from '../../buttons/MoreButton';
import { useCollection } from '@semapps/activitypub-components';

const mentionRegex = /\<a href="([^"]*)" class=\"[^"]*?mention[^"]*?\">@\<span>(.*?)\<\/span>\<\/a\>/gm;

/**
 * Base component for all activity blocks (Note, Video, Event, Article)
 * Handles common functionality like content processing, mentions, and UI structure
 */
const BaseActivityBlock = ({ 
  object, 
  activity, 
  clickOnContent = true,
  renderContent,
  renderMedia,
  renderActions,
  objectUri,
  actorUri,
  published,
  children
}) => {
  const navigate = useNavigate();
  const translate = useTranslate();
  const actor = useActor(actorUri);

  //Mastodon collection URI is nested
  const repliesUri = object?.replies?.id || object?.replies; 
  const likesUri = object?.likes?.id || object?.likes;
  const sharesUri = object?.shares?.id || object?.shares;

  const { totalItems: numReplies } = useCollection(
    repliesUri,
    { dereferenceItems: false, liveUpdates: true, enabled: !!repliesUri}
  );

  const { totalItems: numLikes } = useCollection(
    likesUri,
    { dereferenceItems: false, liveUpdates: true, enabled: !!likesUri}
  );
  const { totalItems: numShares, items: shares} = useCollection(
    sharesUri,
    { dereferenceItems: false, liveUpdates: true, enabled: !!sharesUri}
  );
  
  // Process content with mentions
  const processedContent = useMemo(() => {
    let content = object?.content || object?.contentMap;

    if (!content) {
      return null;
    }

    // If we have a contentMap, take first value
    if (isObject(content)) {
      content = Object.values(content)?.[0];
    }

    //Handle carriage return
    content = content?.replaceAll('\n', '<br>')

    // Find all mentions
    const mentions = arrayOf(object.tag || activity?.tag).filter(tag => tag.type === 'Mention');

    if (mentions.length > 0) {
      // Replace mentions to local actor links
      content = content.replaceAll(mentionRegex, (match, actorUri, actorName) => {
        const mention = actorName.includes('@')
          ? mentions.find(mention => mention.name.startsWith(`@${actorName}`))
          : mentions.find(mention => mention.name.startsWith(`@${actorName}@`));
        if (mention) {
          return match.replace(actorUri, `/actor/${mention.name}`);
        } else {
          return match;
        }
      });
    }

    return content;
  }, [object, activity]);

  // Create content preview
  const contentPreview = useMemo(() => {
    if (!processedContent) return null;
    
    // Create a temporary div to strip HTML and get plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = processedContent;
    const plainText = tempDiv.textContent || tempDiv.innerText;
    
    // Get first 250 characters as preview
    return plainText.substring(0, 250) + '...';
  }, [processedContent]);

  // Get images from attachments
  const images = useMemo(() => {
    return arrayOf(object?.attachment || object?.icon || []);
  }, [object]);

  // Catch links to actors with react-router
  const onContentClick = e => {
    const link = e.target.closest('a')?.getAttribute('href');
    if (link?.startsWith('/actor/')) {
      e.preventDefault();
      navigate(link);
    }
  };

  // Default content renderer
  const defaultContentRenderer = () => {
    if (clickOnContent) {
      return (
        <Link to={`/activity/${encodeURIComponent(activity?.id || object?.id)}`} onClick={onContentClick}>
          <Typography sx={{ color: 'black' }} dangerouslySetInnerHTML={{ __html: processedContent }} />
        </Link>
      );
    } else {
      return (
        <Typography sx={{ color: 'black' }} dangerouslySetInnerHTML={{ __html: processedContent }} />
      );
    }
  };

  // Default actions renderer
  const defaultActionsRenderer = () => (
    <Box pl={8} pt={2} display="flex" justifyContent="space-between">
      <ReplyButton objectUri={object?.id || activity.id} numReplies={numReplies} />
      <BoostButton activity={activity} object={object} numBoosts={numShares} shares={shares}/>
      <LikeButton activity={activity} object={object} numlikes={numLikes}/>
      <MoreButton>
        <MenuItem onClick={event => console.log('event', event)}>{translate('app.action.unfollow')}</MenuItem>
      </MoreButton>
    </Box>
  );

  return (
    <>
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

        {published && (
          <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
            <RelativeDate date={published} sx={{ fontSize: 13, color: 'grey' }} />
          </Box>
        )}

        {/* Render media content (video, images, etc.) */}
        {renderMedia && renderMedia()}

        {/* Render main content */}
        {renderContent ? renderContent(processedContent, contentPreview) : defaultContentRenderer()}

        {/* Render any additional children */}
        {children}
      </Box>

      {/* Render action buttons */}
      {renderActions ? renderActions(numReplies, numShares, shares, numLikes) : defaultActionsRenderer()}
    </>
  );
};

export default BaseActivityBlock; 