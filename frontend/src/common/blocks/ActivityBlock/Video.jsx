import { useMemo, useEffect, useRef, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link, useGetOne, useTranslate } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import Hls from 'hls.js';
import BaseActivityBlock from './BaseActivityBlock';
import useContentProcessing from '../../../hooks/useContentProcessing';
import { arrayOf } from '../../../utils';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const Video = ({ videoUri, activity, clickOnContent }) => {
  const navigate = useNavigate();
  const translate = useTranslate();
  const videoRef = useRef(null);
  const [expanded, setExpanded] = useState(false);

  const { data: video } = useGetOne(
    "Video",
    {
      id: videoUri,
    }
  );

  // Handle attributedTo as an array (PeerTube format)
  const actorUri = Array.isArray(video?.attributedTo) 
    ? video?.attributedTo.find(a => a.type === 'Person')?.id 
    : video?.attributedTo;

  const published = video?.published;
  
  // Process content
  const { processedContent, contentPreview, hasMoreContent } = useContentProcessing(video, activity, {
    previewLength: 100
  });

  const thumbnails = useMemo(() => {
    return arrayOf(video?.icon || []);
  }, [video]);

  // Find all available video sources
  const videoSources = useMemo(() => {
    if (!video?.url) return { hlsSource: null, directSources: [] };
    
    const urls = arrayOf(video.url);
    
    // First, look for HLS playlist
    const hlsSource = urls.find(url => 
      url.mediaType === 'application/x-mpegURL'
    );
    
    // Then, look for direct video files at the top level
    const directSources = urls.filter(url => 
      url.mediaType?.startsWith('video/')
    );
    
    // Finally, if we have an HLS source, also look for MP4s in its tag array
    // (PeerTube specific pattern)
    const nestedSources = [];
    if (hlsSource?.tag) {
      const nestedVideos = arrayOf(hlsSource.tag).filter(
        tag => tag.mediaType?.startsWith('video/')
      );
      nestedSources.push(...nestedVideos);
    }
    
    return { 
      hlsSource, 
      directSources: [...directSources, ...nestedSources]
    };
  }, [video]);
  
  // Set up HLS.js
  useEffect(() => {
    if (!videoRef.current) return;
    
    const { hlsSource, directSources } = videoSources;
    
    // Clean up any existing HLS instance
    let hls;
    
    // First priority: Use HLS if available and supported
    if (hlsSource && Hls.isSupported()) {
      hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60
      });
      
      hls.loadSource(hlsSource.href);
      hls.attachMedia(videoRef.current);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Autoplay if desired
        // videoRef.current.play();
      });
      
      // Error handling
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.warn('HLS error:', data);
        if (data.fatal) {
          switch(data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('Fatal network error, trying to recover');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('Fatal media error, trying to recover');
              hls.recoverMediaError();
              break;
            default:
              // Cannot recover, fall back to direct sources if available
              initializeDirectSource();
              break;
          }
        }
      });
    }
    // Second priority: Use native HLS (Safari)
    else if (hlsSource && videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = hlsSource.href;
    }
    // Last resort: Use direct MP4 sources
    else {
      initializeDirectSource();
    }
    
    function initializeDirectSource() {
      if (directSources.length > 0) {
        // Sort by height (quality) in descending order if available
        const sortedSources = [...directSources].sort((a, b) => 
          (b.height || 0) - (a.height || 0)
        );
        videoRef.current.src = sortedSources[0].href;
      }
    }
    
    return () => {
      // Clean up HLS instance on unmount
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoSources]);

  // Catch links to actors with react-router
  const onContentClick = e => {
    const link = e.target.closest('a')?.getAttribute('href');
    if (link?.startsWith('/actor/')) {
      e.preventDefault();
      navigate(link);
    }
  };

  // Custom content renderer with expand/collapse
  const renderContent = (content, preview) => {
    return (
      <Box sx={{ mt: 2, mb: 2 }}>
        {expanded ? (
          <>
            <Typography 
              sx={{ color: 'black' }} 
              dangerouslySetInnerHTML={{ __html: content }} 
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
              {preview}
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
    );
  };

  // Render video player
  const renderMedia = () => {
    if (!videoSources.hlsSource && videoSources.directSources.length === 0) return null;
    
    return (
      <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
        <video 
          ref={videoRef}
          controls 
          style={{ width: '100%' }}
          poster={thumbnails?.[0]?.url}
          preload="metadata"
        >
          {/* We don't need source elements with HLS.js */}
          {video?.subtitleLanguage?.map(subtitle => (
            <track 
              key={subtitle.identifier}
              kind="subtitles"
              src={subtitle.url}
              srcLang={subtitle.identifier}
              label={subtitle.name}
            />
          ))}
          {translate('app.message.video_not_supported')}
        </video>
      </Box>
    );
  };

  // Render video metadata
  const renderMetadata = () => {
    if (video?.views === undefined) return null;
    
    return (
      <Typography variant="body2" sx={{ color: 'gray', mb: 1 }}>
        {video.views} views • {video.duration?.replace('PT', '').replace('S', 's')}
      </Typography>
    );
  };

  return (
    <BaseActivityBlock
      object={video}
      activity={activity}
      clickOnContent={clickOnContent}
      renderContent={renderContent}
      renderMedia={renderMedia}
      objectUri={videoUri}
      actorUri={actorUri}
      published={published}
    >
      {renderMetadata()}
    </BaseActivityBlock>
  );
};

Video.defaultProps = {
  clickOnContent: true
};

export default Video;
