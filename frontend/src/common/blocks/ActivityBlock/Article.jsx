import { useMemo, useState } from 'react';
import { Box, Typography, Modal, IconButton } from '@mui/material';
import { Link, useGetOne, useTranslate } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import BaseActivityBlock from './BaseActivityBlock';
import useContentProcessing from '../../../hooks/useContentProcessing';
import { arrayOf } from '../../../utils';
import CloseIcon from '@mui/icons-material/Close';

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
  const published = article?.published;
  
  // Process content using our custom hook
  const { processedContent, contentPreview } = useContentProcessing(article, activity, {
    previewLength: 250
  });

  // Use icon as cover image if available
  const coverImage = article?.icon?.url;
  const title = article?.name;

  // Get images from attachments
  const images = arrayOf(article?.attachment || article?.icon || []);

  // Catch links to actors with react-router
  const onContentClick = e => {
    const link = e.target.closest('a')?.getAttribute('href');
    if (link?.startsWith('/actor/')) {
      e.preventDefault();
      navigate(link);
    }
  };

  // Custom content renderer
  const renderContent = (content, preview) => {
    return (
      <>
        <Typography sx={{ color: 'black' }}>{preview}</Typography>
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
      </>
    );
  };

  // Render cover image and title
  const renderMedia = () => {
    if (!coverImage && !title) return null;
    
    return (
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
    );
  };

  return (
    <>
      <BaseActivityBlock
        object={article}
        activity={activity}
        clickOnContent={clickOnContent}
        renderContent={renderContent}
        renderMedia={renderMedia}
        objectUri={articleUri}
        actorUri={actorUri}
        published={published}
      />

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
