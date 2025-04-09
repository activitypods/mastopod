import { useMemo, useState } from 'react';
import isObject from 'isobject';
import { Box, Avatar, Typography, MenuItem, Modal, IconButton } from '@mui/material';
import { Link, useGetOne, useTranslate } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import LikeButton from '../../buttons/LikeButton';
import BoostButton from '../../buttons/BoostButton';
import ReplyButton from '../../buttons/ReplyButton';
import RelativeDate from '../../RelativeDate';
import useActor from '../../../hooks/useActor';
import { arrayOf } from '../../../utils';
import MoreButton from '../../buttons/MoreButton';
import { useCollection } from '@semapps/activitypub-components';
import CloseIcon from '@mui/icons-material/Close';

const mentionRegex = /\<a href="([^"]*)" class=\"[^"]*?mention[^"]*?\">@\<span>(.*?)\<\/span>\<\/a\>/gm;

const Article = ({ articleUri, activity, clickOnContent }) => {
  const navigate = useNavigate();
  const translate = useTranslate();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: article } = useGetOne(
    "Article",
    {
      id: articleUri,
    }
  );
  const actorUri = article?.attributedTo;

  const actor = useActor(actorUri);

  //Mastodon collection URI is nested
  const repliesUri = article?.replies?.id || article?.replies; 
  const likesUri = article?.likes?.id || article?.likes;
  const sharesUri = article?.shares?.id || article?.shares;

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
  
  const content = useMemo(() => {
    let content = article?.content || article?.contentMap;

    if (!content) {
      return null;
    }

    // If we have a contentMap, take first value
    if (isObject(content)) {
      content = Object.values(content)?.[0];
    }

    // Create a temporary div to strip HTML and get plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText;
    
    // Get first 250 characters as preview
    const contentPreview = plainText.substring(0, 250) + '...';

    return contentPreview;
  }, [article]);

  const fullContent = useMemo(() => {
    let content = article?.content || article?.contentMap;

    if (!content) {
      return null;
    }

    if (isObject(content)) {
      content = Object.values(content)?.[0];
    }

    //Handle carriage return
    content = content?.replaceAll('\n', '<br>')

    // Find all mentions
    const mentions = arrayOf(article.tag || activity?.tag).filter(tag => tag.type === 'Mention');

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
  }, [article, activity]);

  // Use icon as cover image if available
  const coverImage = article?.icon?.url;
  const title = article?.name;

  const images = useMemo(() => {
    return arrayOf(article?.attachment || article?.icon || []);
  }, [article]);

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

        {article?.published && (
          <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
            <RelativeDate date={article?.published} sx={{ fontSize: 13, color: 'grey' }} />
          </Box>
        )}

        {(coverImage || title) && (
          <Box
            sx={{
              position: 'relative',
              height: 200,
              width: '100%',
              mt: 2,
              mb: 2,
              bgcolor: 'grey.800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,
              overflow: 'hidden'
            }}
          >
            {coverImage && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${coverImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  }
                }}
              />
            )}
            {title && (
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  position: 'relative',
                  zIndex: 1,
                  px: 3,
                  textAlign: 'center',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                }}
              >
                {title}
              </Typography>
            )}
          </Box>
        )}

        {clickOnContent ? (
          <Link to={`/activity/${encodeURIComponent(activity?.id || article?.id)}`} onClick={onContentClick}>
            <Typography sx={{ color: 'black' }}>{content}</Typography>
          </Link>
        ) : (
          <Typography sx={{ color: 'black' }}>{content}</Typography>
        )}
        <Typography
          component="span"
          sx={{
            color: 'primary.main',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' }
          }}
          onClick={() => setModalOpen(true)}
        >
          {translate('app.action.read_more')}
        </Typography>
      </Box>
      <Box pl={8} pt={2} display="flex" justifyContent="space-between">
        <ReplyButton objectUri={article?.id || activity.id} numReplies={numReplies} />
        <BoostButton activity={activity} object={article} numBoosts={numShares} shares={shares}/>
        <LikeButton activity={activity} object={article} numlikes={numLikes}/>
        <MoreButton>
          <MenuItem onClick={event => console.log('event', event)}>{translate('app.action.unfollow')}</MenuItem>
        </MoreButton>
      </Box>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="article-modal-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '95%',
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 1,
            overflow: 'auto'
          }}
        >
          <IconButton
            onClick={() => setModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              zIndex: 1,
              bgcolor: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            sx={{
              position: 'relative',
              height: 400,
              width: '100%',
              mb: 4,
              bgcolor: 'grey.800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {coverImage && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${coverImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  }
                }}
              />
            )}
            {title && (
              <Typography
                variant="h3"
                id="article-modal-title"
                sx={{
                  color: 'white',
                  position: 'relative',
                  zIndex: 1,
                  px: 4,
                  textAlign: 'center',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                {title}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              maxWidth: 700,
              mx: 'auto',
              px: 4,
              pb: 4,
            }}
          >
            <Typography 
              component="div"
              sx={{ 
                '& img': { maxWidth: '100%', height: 'auto' },
                '& a': { color: 'primary.main' },
                '& p': { mb: 2 },
                fontSize: '1.1rem',
                lineHeight: 1.7
              }}
              dangerouslySetInnerHTML={{ __html: fullContent }} 
            />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

Article.defaultProps = {
  clickOnContent: true
};

export default Article;
