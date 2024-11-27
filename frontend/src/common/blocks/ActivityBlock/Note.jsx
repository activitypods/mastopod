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

const mentionRegex = /\<a href="([^"]*)" class=\"[^"]*?mention[^"]*?\">@\<span>(.*?)\<\/span>\<\/a\>/gm;

const Note = ({ object, activity, clickOnContent }) => {
  const navigate = useNavigate();
  const translate = useTranslate();
  const actorUri = object?.attributedTo;

  const actor = useActor(actorUri);

  const content = useMemo(() => {
    let content = object.content || object.contentMap;

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

  const images = useMemo(() => {
    return arrayOf(object.attachment || object.icon || []);
  }, [object]);

  // Catch links to actors with react-router
  const onContentClick = e => {
    const link = e.target.closest('a')?.getAttribute('href');
    if (link?.startsWith('/actor/')) {
      e.preventDefault();
      navigate(link);
    }
  };

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

        {object?.published && (
          <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
            <RelativeDate date={object?.published} sx={{ fontSize: 13, color: 'grey' }} />
          </Box>
        )}
        {clickOnContent ? (
          <Link to={`/activity/${encodeURIComponent(activity?.id || object.id)}`} onClick={onContentClick}>
            <Typography sx={{ color: 'black' }} dangerouslySetInnerHTML={{ __html: content }} />
          </Link>
        ) : (
          <Typography sx={{ color: 'black' }} dangerouslySetInnerHTML={{ __html: content }} />
        )}
        {images && images.map(image => <img src={image?.url} style={{ width: "100%", marginTop: 10 }} />)}
      </Box>
      <Box pl={8} pt={2} display="flex" justifyContent="space-between">
        <ReplyButton objectUri={object.id || activity.id} />
        <BoostButton activity={activity} object={object} />
        <LikeButton activity={activity} object={object} />
        <MoreButton>
          <MenuItem onClick={event => console.log('event', event)}>{translate('app.action.unfollow')}</MenuItem>
        </MoreButton>
      </Box>
    </>
  );
};

Note.defaultProps = {
  clickOnContent: true
};

export default Note;
