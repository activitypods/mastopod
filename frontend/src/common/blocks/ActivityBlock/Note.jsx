import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { Link, useGetOne, useTranslate } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import BaseActivityBlock from './BaseActivityBlock';
import useContentProcessing from '../../../hooks/useContentProcessing';
import { arrayOf } from '../../../utils';

/**
 * Note component - Displays a note activity
 * 
 * @param {object} props
 * @param {string} props.noteUri - The URI of the note
 * @param {object} props.activity - The activity data
 * @param {boolean} props.clickOnContent - Whether the content is clickable
 */
const Note = ({ noteUri, activity, clickOnContent }) => {
  const navigate = useNavigate();
  const translate = useTranslate();
  
  const { data: note } = useGetOne(
    "Note",
    {
      id: noteUri,
    }
  );
  
  const noteObject = note || activity.object;
  const actorUri = noteObject?.attributedTo;
  
  // Process content using our custom hook
  const { processedContent } = useContentProcessing(noteObject, activity);
  
  // Get images from attachments
  const images = useMemo(() => {
    return arrayOf(noteObject?.attachment || noteObject?.icon || []);
  }, [noteObject]);
  
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
      object={noteObject}
      activity={activity}
      objectUri={noteUri}
      actorUri={actorUri}
    >    
      {/* Render content */}
      {clickOnContent ? (
        <Link to={`/activity/${encodeURIComponent(activity?.id || noteObject?.id)}`} onClick={onContentClick}>
          <Typography sx={{ color: 'black' }} dangerouslySetInnerHTML={{ __html: processedContent }} />
        </Link>
      ) : (
        <Typography sx={{ color: 'black' }} dangerouslySetInnerHTML={{ __html: processedContent }} />
      )}
      {/* Render images if available */}
      {images.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {images.map((image, index) => (
            <Box
              key={index}
              component="img"
              src={image.url}
              alt={image.name || 'Image'}
              sx={{
                maxWidth: '100%',
                maxHeight: 300,
                borderRadius: 1,
                objectFit: 'contain'
              }}
            />
          ))}
        </Box>
      )}

    </BaseActivityBlock>
  );
};

Note.defaultProps = {
  clickOnContent: true
};

export default Note;
