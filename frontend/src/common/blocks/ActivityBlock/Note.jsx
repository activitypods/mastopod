import { Box, Typography } from '@mui/material';
import { Link, useGetOne } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import BaseActivityBlock from './BaseActivityBlock';
import useContentProcessing from '../../../hooks/useContentProcessing';
import { arrayOf } from '../../../utils';

const Note = ({ noteUri, activity, clickOnContent }) => {
  const navigate = useNavigate();

  const { data: note } = useGetOne(
    "Note",
    {
      id: noteUri,
    }
  );
  
  const actorUri = note?.attributedTo;
  const published = note?.published;
  
  // Process content
  const { processedContent } = useContentProcessing(note, activity);
  
  // Get images from attachments
  const images = arrayOf(note?.attachment || note?.icon || []);

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
    if (clickOnContent) {
      return (
        <Link to={`/activity/${encodeURIComponent(activity?.id || note?.id)}`} onClick={onContentClick}>
          <Typography sx={{ color: 'black' }} dangerouslySetInnerHTML={{ __html: content }} />
        </Link>
      );
    } else {
      return (
        <Typography sx={{ color: 'black' }} dangerouslySetInnerHTML={{ __html: content }} />
      );
    }
  };

  // Render images if any
  const renderMedia = () => {
    if (images.length === 0) return null;
    
    return (
      <Box sx={{ mt: 2, mb: 2 }}>
        {images.map((image, index) => (
          <img 
            key={index} 
            src={image?.url} 
            style={{ width: "100%", marginTop: 10 }} 
            alt=""
          />
        ))}
      </Box>
    );
  };

  return (
    <BaseActivityBlock
      object={note}
      activity={activity}
      clickOnContent={clickOnContent}
      renderContent={renderContent}
      renderMedia={renderMedia}
      objectUri={noteUri}
      actorUri={actorUri}
      published={published}
    />
  );
};

Note.defaultProps = {
  clickOnContent: true
};

export default Note;
