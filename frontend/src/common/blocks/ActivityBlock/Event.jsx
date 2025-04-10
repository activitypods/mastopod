import { useMemo, useState, useCallback, useEffect } from 'react';
import { Box, Typography, Modal, IconButton } from '@mui/material';
import { useGetOne, useTranslate, useLocaleState, Link } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import BaseActivityBlock from './BaseActivityBlock';
import useContentProcessing from '../../../hooks/useContentProcessing';
import { arrayOf } from '../../../utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { enGB } from 'date-fns/locale';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TagIcon from '@mui/icons-material/Tag';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Link as MuiLink } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Button from '@mui/material/Button';

/**
 * Event component - Displays an event activity
 * 
 * @param {Object} props
 * @param {string} props.eventUri - The URI of the event
 * @param {Object} props.activity - The activity data
 * @param {boolean} props.clickOnContent - Whether the content is clickable
 */
const Event = ({ eventUri, activity, clickOnContent }) => {
  const navigate = useNavigate();
  const translate = useTranslate();
  const [modalOpen, setModalOpen] = useState(false);
  const [locale] = useLocaleState();
  // put the dateLocale in the state and update it when the locale changes
  const [dateLocale, setDateLocale] = useState(locale === 'fr' ? fr : enGB);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    setDateLocale(locale === 'fr' ? fr : enGB);
  }, [locale]);
  
  const event = activity.object;
  const actorUri = event?.attributedTo;
  
  // Process content using our custom hook
  const { processedContent, contentPreview, hasMoreContent } = useContentProcessing(event, activity, {
    previewLength: 200
  });

  // Get cover image from attachments
  const coverImage = useMemo(() => {
    const imageAttachment = arrayOf(event?.attachment).find(
      att => 
        (typeof att.mediaType === 'string' && att.mediaType.startsWith('image/')) ||
        (typeof att.mediaType === 'object' && att.mediaType['@value'].startsWith('image/'))
    );
    return imageAttachment?.url;
  }, [event]);

  // Get hashtags
  const hashtags = useMemo(() => {
    return arrayOf(event?.tag).filter(tag => tag.type === 'Hashtag').map(tag => tag.name);
  }, [event]);

  const formatEventDate = useCallback((date) => {
    return format(new Date(date), "d MMMM yyyy HH:mm", { locale: dateLocale });
  }, [dateLocale]);

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
        object={event}
        activity={activity}
        objectUri={eventUri}
        actorUri={actorUri}
      >
        {/* Render cover image and title */}
        <Box
          sx={{
            position: 'relative',
            height: 200,
            width: '100%',
            mt: 2,
            bgcolor: 'grey.800',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
            overflow: 'hidden',
            cursor: 'pointer'
          }}
          onClick={() => setModalOpen(true)}
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
          <Typography variant="h5" sx={{ 
            position: 'relative',
            zIndex: 1,
            color: 'white',
            textAlign: 'center',
            p: 2,
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>
            {event?.name}
          </Typography>
        </Box>

        {/* Render event details */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AccessTimeIcon sx={{ mr: 1, color: 'grey.600' }} />
            <Typography>{formatEventDate(event?.startTime)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOnIcon sx={{ mr: 1, color: 'grey.600' }} />
            <Typography>{event?.location?.name}</Typography>
          </Box>
          {event?.url && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <OpenInNewIcon sx={{ mr: 1, color: 'grey.600' }} />
              <MuiLink 
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                {translate('app.action.event_url')}
              </MuiLink>
            </Box>
          )}
          
          {hashtags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <TagIcon sx={{ color: 'grey.500' }} />
              {hashtags.map(tag => (
                <Typography
                  key={tag}
                  sx={{
                    bgcolor: 'grey.100',
                    px: 1,
                    borderRadius: 1,
                    fontSize: '0.9rem'
                  }}
                >
                  {tag}
                </Typography>
              ))}
            </Box>
          )}
          {expanded ? (
          <>
            {clickOnContent ? (
              <Link to={`/activity/${encodeURIComponent(activity?.id || noteObject?.id)}`} onClick={onContentClick}>
                <Typography 
                  sx={{ color: 'black' }} 
                  dangerouslySetInnerHTML={{ __html: processedContent }} 
                />
              </Link>
            ) : (
              <Typography 
                sx={{ color: 'black' }} 
                dangerouslySetInnerHTML={{ __html: processedContent }} 
              />
            )}
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
            {clickOnContent ? (
              <Link to={`/activity/${encodeURIComponent(activity?.id || noteObject?.id)}`} onClick={onContentClick}>
                <Typography 
                  sx={{ color: 'black' }} 
                  dangerouslySetInnerHTML={{ __html: processedContent }} 
                />
              </Link>
            ) : (
              <Typography 
                sx={{ color: 'black' }} 
                dangerouslySetInnerHTML={{ __html: processedContent }} 
              />
            )}
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

      {/* Modal for full event details */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="event-modal-title"
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
            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                color: 'white',
                textAlign: 'center',
                p: 3
              }}
            >
              <Typography variant="h3" sx={{ mb: 3, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                {event?.name}
              </Typography>
              <Typography variant="h5" sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                {formatEventDate(event?.startTime)}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              maxWidth: 700,
              mx: 'auto',
              px: 4,
              py: 4,
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Informations</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <LocationOnIcon sx={{ mr: 2 }} />
                  <Typography>
                    {event?.location?.name}<br />
                    {event?.location?.address?.streetAddress}<br />
                    {event?.location?.address?.postalCode} {event?.location?.address?.addressLocality}<br />
                    {event?.location?.address?.addressRegion}, {event?.location?.address?.addressCountry}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <AccessTimeIcon sx={{ mr: 2 }} />
                  <Typography>
                    {translate('app.action.event_start_date')}: {formatEventDate(event?.startTime)}<br />
                    {translate('app.action.event_end_date')}: {formatEventDate(event?.endTime)}
                  </Typography>
                </Box>
                {event?.url && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <OpenInNewIcon sx={{ mr: 2 }} />
                    <MuiLink
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        color: 'primary.main',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      {translate('app.action.event_url')}
                    </MuiLink>
                  </Box>
                )}
              </Box>
            </Box>

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

Event.defaultProps = {
  clickOnContent: true
};

export default Event; 