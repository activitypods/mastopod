import { useMemo } from 'react';
import isObject from 'isobject';
import { arrayOf } from '../utils';

const mentionRegex = /\<a href="([^"]*)" class=\"[^"]*?mention[^"]*?\">@\<span>(.*?)\<\/span>\<\/a\>/gm;

/**
 * Custom hook for processing content with mentions and creating previews
 * @param {Object} object - The object containing content
 * @param {Object} activity - The activity object
 * @param {Object} options - Options for content processing
 * @returns {Object} - Processed content and preview
 */
const useContentProcessing = (object, activity, options = {}) => {
  const { 
    previewLength = 250,
    stripHtml = true,
    processMentions = true
  } = options;

  // Process content with mentions
  const processedContent = useMemo(() => {
    let content = object?.content || object?.contentMap;

    if (!content) {
      return null;
    }

    // If we have a contentMap, take first value
    if (isObject(content)) {
      content = Object.values(content)?.[0];
    }

    //Handle carriage return
    content = content?.replaceAll('\n', '<br>')

    // Process mentions if enabled
    if (processMentions) {
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
    }

    return content;
  }, [object, activity, processMentions]);

  // Create content preview
  const contentPreview = useMemo(() => {
    if (!processedContent) return null;
    
    if (stripHtml) {
      // Create a temporary div to strip HTML and get plain text
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = processedContent;
      const plainText = tempDiv.textContent || tempDiv.innerText;
      
      // Get first N characters as preview
      return plainText.length > previewLength 
        ? plainText.substring(0, previewLength) + '...' 
        : plainText;
    } else {
      // If not stripping HTML, just truncate the content
      return processedContent.length > previewLength 
        ? processedContent.substring(0, previewLength) + '...' 
        : processedContent;
    }
  }, [processedContent, previewLength, stripHtml]);

  return {
    processedContent,
    contentPreview,
    hasMoreContent: processedContent && contentPreview?.endsWith('...')
  };
};

export default useContentProcessing; 