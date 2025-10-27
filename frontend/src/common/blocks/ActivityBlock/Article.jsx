import { useState } from 'react';
import { Box, Typography, Modal, IconButton } from '@mui/material';
import { Link, useGetOne, useTranslate } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import BaseActivityBlock from './BaseActivityBlock';
import useContentProcessing from '../../../hooks/useContentProcessing';
import { arrayOf } from '../../../utils';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Article component - Displays an article activity
 * 
 * @param {object} props
 * @param {string} props.articleUri - The URI of the article
 * @param {object} props.activity - The activity data
 * @param {boolean} props.clickOnContent - Whether the content is clickable
 */
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

  const articleObject = article || activity.object;

  const actorUri = arrayOf(articleObject?.attributedTo)
                    .map(actorOrUri => actorOrUri?.id || actorOrUri)[0];

  // Process content
  const { processedContent, contentPreview } = useContentProcessing(articleObject, activity, {
    previewLength: 150
  });
  // Use icon as cover image if available
  const coverImage = article?.icon?.url;
  const title = article?.name;


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
      <BaseActivityBlock
        object={articleObject}
        activity={activity}
        objectUri={articleUri}
        actorUri={actorUri}
      >
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
            <Typography sx={{ color: 'black' }}>{contentPreview}</Typography>
          </Link>
        ) : (
          <Typography sx={{ color: 'black' }}>{contentPreview}</Typography>
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
      </BaseActivityBlock>
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
              dangerouslySetInnerHTML={{ __html: processedContent }}
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
