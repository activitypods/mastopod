import { useMemo, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link, useGetOne, useTranslate } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import BaseActivityBlock from './BaseActivityBlock';
import useContentProcessing from '../../../hooks/useContentProcessing';
import { arrayOf } from '../../../utils';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

/**
 * Article component - Displays an article activity
 * 
 * @param {Object} props
 * @param {string} props.articleUri - The URI of the article
 * @param {Object} props.activity - The activity data
 * @param {boolean} props.clickOnContent - Whether the content is clickable
 */
const Article = ({ articleUri, activity, clickOnContent }) => {
  const navigate = useNavigate();
  const translate = useTranslate();
  const [expanded, setExpanded] = useState(false);

  const { data: article } = useGetOne(
    "Article",
    {
      id: articleUri,
    }
  );

  const articleObject = article || activity.object;
  const actorUri = articleObject?.attributedTo;
  const published = articleObject?.published;
  
  // Process content
  const { processedContent, contentPreview, hasMoreContent } = useContentProcessing(articleObject, activity, {
    previewLength: 150
  });

  // Get images from attachments
  const images = useMemo(() => {
    return arrayOf(articleObject?.attachment || articleObject?.icon || []);
  }, [articleObject]);
  
  // Catch links to actors with react-router
  const onContentClick = e => {
    const link = e.target.closest('a')?.getAttribute('href');
    if (link?.startsWith('/actor/')) {
      e.preventDefault();
      navigate(link);
    }
  };

  return (
    <BaseActivityBlock
      object={articleObject}
      activity={activity}
      objectUri={articleUri}
      actorUri={actorUri}
    >
      {/* Render cover image if available */}
      {images.length > 0 && (
        <Box 
          sx={{ 
            width: '100%', 
            height: 200, 
            mt: 2, 
            mb: 2,
            borderRadius: 1,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <Box
            component="img"
            src={images[0].url}
            alt={images[0].name || 'Article cover'}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Box>
      )}
      
      {/* Render content with expand/collapse */}
      <Box sx={{ mt: 2, mb: 2 }}>
        {expanded ? (
          <>
            <Typography 
              sx={{ color: 'black' }} 
              dangerouslySetInnerHTML={{ __html: processedContent }} 
            />
            <Button 
              onClick={() => setExpanded(false)}
              size="small"
              sx={{ mt: 1, textTransform: 'none' }}
              endIcon={<ExpandLessIcon />}
            >
              {translate('app.action.show_less')}
            </Button>
          </>
        ) : (
          <>
            <Typography sx={{ color: 'black' }}>
              {contentPreview}
            </Typography>
            {hasMoreContent && (
              <Button 
                onClick={() => setExpanded(true)}
                size="small"
                sx={{ mt: 1, textTransform: 'none' }}
                endIcon={<ExpandMoreIcon />}
              >
                {translate('app.action.show_more')}
              </Button>
            )}
          </>
        )}
      </Box>
    </BaseActivityBlock>
  );
};

Article.defaultProps = {
  clickOnContent: true
};

export default Article;
