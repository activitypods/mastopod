import { useMemo, useEffect, useRef } from 'react';
import isObject from 'isobject';
import { Box, Avatar, Typography, MenuItem } from '@mui/material';
import { Link, useGetOne, useTranslate } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import Hls from 'hls.js';
import LikeButton from '../../buttons/LikeButton';
import BoostButton from '../../buttons/BoostButton';
import ReplyButton from '../../buttons/ReplyButton';
import RelativeDate from '../../RelativeDate';
import useActor from '../../../hooks/useActor';
import { arrayOf } from '../../../utils';
import MoreButton from '../../buttons/MoreButton';
import { useCollection } from '@semapps/activitypub-components';

const mentionRegex = /\<a href="([^"]*)" class=\"[^"]*?mention[^"]*?\">@\<span>(.*?)\<\/span>\<\/a\>/gm;

const Video = ({ videoUri, activity, clickOnContent }) => {
  const navigate = useNavigate();
  const translate = useTranslate();
  const videoRef = useRef(null);

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

  const actor = useActor(actorUri);

  //Mastodon collection URI is nested
  const repliesUri = video?.replies?.id || video?.replies || video?.comments; 
  const likesUri = video?.likes?.id || video?.likes;
  const sharesUri = video?.shares?.id || video?.shares;

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
    let content = video?.content || video?.contentMap || video?.name;

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
    const mentions = arrayOf(video?.tag || activity?.tag).filter(tag => tag.type === 'Mention');

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
  }, [video, activity]);

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

        {video?.published && (
          <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
            <RelativeDate date={video?.published} sx={{ fontSize: 13, color: 'grey' }} />
          </Box>
        )}
        <Typography sx={{ color: 'black', mb: 2 }} dangerouslySetInnerHTML={{ __html: content }} />
        
        {/* Display video player */}
        {videoSources.hlsSource || videoSources.directSources.length > 0 ? (
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
              Your browser does not support the video tag.
            </video>
          </Box>
        ) : null}
        
        {/* Show video metadata */}
        {video?.views !== undefined && (
          <Typography variant="body2" sx={{ color: 'gray', mb: 1 }}>
            {video.views} views • {video.duration?.replace('PT', '').replace('S', 's')}
          </Typography>
        )}
      </Box>
      <Box pl={8} pt={2} display="flex" justifyContent="space-between">
        <ReplyButton objectUri={video?.id || activity?.id} numReplies={numReplies} />
        <BoostButton activity={activity} object={video} numBoosts={numShares} shares={shares}/>
        <LikeButton activity={activity} object={video} numlikes={numLikes}/>
        <MoreButton>
          <MenuItem onClick={event => console.log('event', event)}>{translate('app.action.unfollow')}</MenuItem>
        </MoreButton>
      </Box>
    </>
  );
};

Video.defaultProps = {
  clickOnContent: true
};

export default Video;
