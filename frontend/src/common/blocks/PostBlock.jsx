import { useRef, useEffect, useState, useMemo } from 'react';
import {
  Form,
  useNotify,
  useTranslate,
  useGetIdentity,
  useRedirect,
  useDataProvider,
  SelectInput
} from 'react-admin';
import { useLocation } from 'react-router-dom';
import { Card, Box, Button, IconButton, CircularProgress, Backdrop, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import DeleteIcon from '@mui/icons-material/Delete';
import PublicIcon from '@mui/icons-material/Public';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import {
  useOutbox,
  OBJECT_TYPES,
  PUBLIC_URI
} from '@semapps/activitypub-components';
import { useCallback } from 'react';
import { RichTextInput, DefaultEditorOptions } from 'ra-input-rich-text';
import { useCollection } from '@semapps/activitypub-components';
import useMentions from '../../hooks/useMentions/useMentions.js';
import Placeholder from '@tiptap/extension-placeholder';
import Mention from '@tiptap/extension-mention';
import { HardBreak } from '@tiptap/extension-hard-break';
import { uniqBy, sortBy } from 'lodash';
import { required } from 'ra-core';

const PostBlock = ({ inReplyTo, mention }) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const redirect = useRedirect();
  const inputRef = useRef(null);
  const outbox = useOutbox();
  const translate = useTranslate();
  const { hash } = useLocation();
  const { data: identity } = useGetIdentity();
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useTheme();

  //List of mentionable actors
  const { items: followers } = useCollection('followers', { dereferenceItems: true });
  const { items: following } = useCollection('following', { dereferenceItems: true });
  const mentionables = useMemo(() => sortBy(uniqBy([...followers, ...following], 'id'), 'preferredUsername').map((actor) => {
    const instance = new URL(actor.id).host;
    return {
      id: actor.id,
      label: `${actor['preferredUsername']}@${instance}`,
      actor: actor
    };
  }), [followers, following]);

  const suggestions = useMentions(mentionables);

  // Doesn't work
  useEffect(() => {
    if (hash === '#reply' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hash, inputRef.current]);

  const uploadImage = useCallback(async (file) => {
    try {
      let imageUrl = await dataProvider.uploadFile(file);
      return imageUrl;
    } catch (error) {
      console.error(error);
      throw new Error(translate('app.notification.image_upload_error'));
    }
  }, [dataProvider, translate]);

  const handleAttachments = useCallback(async () => {
    const attachments = await Promise.all(
      imageFiles.map(async (file) => {
        const imageUrl = await uploadImage(file.file);
        return {
          type: 'Image',
          mediaType: file.type,
          url: imageUrl
        };
      })
    );
    return attachments;
  }, [imageFiles, uploadImage]);

  const clearForm = useCallback(() => {
    // still looking for a way to clear the actual form
    // Clearing local URL for image preview (avoid memory leaks)
    imageFiles.forEach((image) => URL.revokeObjectURL(image.preview));
    setImageFiles([]);
  }, []);

  /*
    The RichTextInput provides an HTML result with (by default) a new <p> for each new line
    The HardBreak extension avoids multiple paragraphs by using <br> when enter is pressed
    We end up with a wrapping <p> and some <br> inside so let's make it look like what TextInput would have produced
    and collect mentioned users URI at the same time
    e.g.
      <p>line1<br>line2<br><span class="mention" data-id="https://mypod.store/alice" data-label="patrick">@alice</span><br></p>
        =>  {
              processedContent: "line1\nline2\n<a href="https://mypod.store/alice" class="mention">@<span>alice</span></a>",
              mentionedUserUris : ["http://mypod.store/alice"]
            }
  */
  const processEditorContent = useCallback((content) => {
    const document = new DOMParser().parseFromString(content, 'text/html');
    const mentionNodes = Array.from(document.body.getElementsByClassName('mention'));

    const mentionedUsersUris = [];

    mentionNodes.forEach((node) => {
      const userUri = node.attributes['data-id'].value;
      const userLabel = node.attributes['data-label'].value;
      const link = document.createElement('a');
      link.setAttribute('href', userUri);
      link.setAttribute('class', 'mention');
      const atTextNode = document.createTextNode('@');
      const spanNode = document.createElement('span');
      spanNode.textContent = userLabel;
      link.appendChild(atTextNode);
      link.appendChild(spanNode);

      node.parentNode.replaceChild(link, node);
      mentionedUsersUris.push(userUri);
    });

    const paragraph = document.querySelector('p');
    return {
      processedContent: paragraph
        ? paragraph.innerHTML.replace(/<br\s*\/?>/gi, '\n').trim()
        : '',
      mentionedUsersUris
    };
  }, []);

  const getFormattedMentions = useCallback((mentionedUsersUris) => {
    return mentionedUsersUris.map((uri) => {
      const actor = mentionables.find((m) => m.id === uri);
      if (actor) {
        const actorName = actor.actor['foaf:nick'] || actor.actor.preferredUsername || 'unknown';
        const instance = new URL(actor.id).host;
        return {
          type: 'Mention',
          href: actor.id,
          name: `@${actorName}@${instance}`
        };
      }
      return null;
    }).filter(Boolean);
  }, []);

  const getRecipients = useCallback((mentionedUsersUris, values) => {
    const recipients = mentionedUsersUris;
    if (values.visibility === 'public') {
      recipients.push(PUBLIC_URI, identity?.webIdData?.followers);
    } else if (values.visibility === 'followers-only') {
      recipients.push(identity?.webIdData?.followers);
    }
    if (mention) {
      recipients.push(mention);
    }
    return recipients;
  }, [identity, mention]);

  const onSubmit = useCallback(
    async (values, { reset }) => {
      setIsSubmitting(true);
      try {
        const { processedContent, mentionedUsersUris } = processEditorContent(values.content);

        const activity = {
          type: OBJECT_TYPES.NOTE,
          attributedTo: outbox.owner,
          content: processedContent,
          inReplyTo,
          to: getRecipients(mentionedUsersUris, values)
        };

        //handle attachments
        let attachments = await handleAttachments();
        if (attachments.length > 0) {
          activity.attachment = attachments;
        }

        //handle mentions
        const formattedMentions = getFormattedMentions(mentionedUsersUris);
        if (formattedMentions.length > 0) {
          activity.tag = formattedMentions;
        }

        //post the activity
        const activityUri = await outbox.post(activity);
        notify('app.notification.message_sent', { type: 'success' });
        clearForm();

        if (inReplyTo) {
          redirect(`/activity/${encodeURIComponent(activityUri)}`);
        }
      } catch (e) {
        notify('app.notification.activity_send_error', {
          type: 'error',
          messageArgs: { error: e.message }
        });
        console.error(e);
      } finally {
        setIsSubmitting(false);
      }
    },
    [outbox, identity, notify, mention, inReplyTo, redirect]
  );

  const handleFileChange = useCallback((event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImageFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, []);

  const handleRemoveImage = useCallback((index) => {
    setImageFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      const [removedFile] = updatedFiles.splice(index, 1);

      URL.revokeObjectURL(removedFile.preview);

      return updatedFiles;
    });
  }, []);

  //revoke preview URL at unmount time to avoid further memory leaks cases
  useEffect(() => {
    return () => {
      imageFiles.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, []);

  return (
    <Card>
      <Box p={2} position="relative">
        <Backdrop
          sx={{
            color: '#fff',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: 1
          }}
          open={isSubmitting}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Form onSubmit={onSubmit}>
          <RichTextInput
            source="content"
            helperText={false}
            label={false}
            toolbar={<></>}
            editorOptions={{
              ...DefaultEditorOptions,
              extensions: [
                ...DefaultEditorOptions.extensions.map(ext =>
                  ext.name === 'starterKit'
                    ? ext.configure({
                      hardBreak: false
                    })
                    : ext
                ),
                //To avoid creating a new paragraph (<p>) each time Enter is pressed
                HardBreak.extend({
                  addKeyboardShortcuts() {
                    return {
                      Enter: () => this.editor.commands.setHardBreak()
                    };
                  }
                }),
                Placeholder.configure({
                  placeholder: inReplyTo
                    ? translate('app.input.reply')
                    : translate('app.input.message')
                }),
                Mention.configure({
                  HTMLAttributes: {
                    class: 'mention'
                  },
                  suggestion: suggestions
                })
              ]
            }}
            sx={{
              //To display the placeholder, as per tiptap documentation
              '.ProseMirror p.is-editor-empty:first-of-type::before': {
                content: `attr(data-placeholder)`,
                float: 'left',
                color: 'rgba(0, 0, 0, 0.6)',
                pointerEvents: 'none',
                height: 0
              },
              //Styling the RichTextInput to look like a TextInput
              '& .RaRichTextInput-editorContent': {
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8.5px 14px 8.5px 14px'
              },
              '& .tiptap.ProseMirror': {
                backgroundColor: '#fff',
                minHeight: '91px',
                outline: 'none',
                border: 'none',
                fontSize: '16px',
                color: '#000',
                padding: 0
              },
              '& .tiptap.ProseMirror:hover': {
                backgroundColor: '#fff'
              },
              '& .tiptap.ProseMirror:focus': {
                backgroundColor: '#fff',
                border: 'none'
              },
              //Styling the mentions
              '& .tiptap.ProseMirror .mention': {
                fontStyle: 'italic',
                color: theme.palette.primary.main,
                textDecoration: 'none'
              }
            }}
            fullWidth
            multiline
            autoFocus={hash === '#reply'}
          />

          {/*Preview of selected pictures*/}
          {imageFiles.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'wrap',
                mt: 1
              }}
            >
              {imageFiles.map((image, index) => (
                <Box
                  key={image.preview}
                  sx={{
                    height: 80,
                    borderRadius: 1,
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <img
                    src={image.preview}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <IconButton
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      zIndex: 2,
                      padding: '4px',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        color: '#ff5252'
                      }
                    }}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={imageFiles.length > 0 ? 2 : 0}
               flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={1}>
              <SelectInput
                validate={required()}
                helperText={false}
                label={false}
                source="visibility"
                defaultValue="public"
                parse={(value) => value || 'public'} //if empty, fallback to public
                choices={[
                  { id: 'public', name: translate('app.visibility.public') },
                  { id: 'followers-only', name: translate('app.visibility.followersOnly') },
                  { id: 'mentions-only', name: translate('app.visibility.mentionsOnly') }
                ]}
                optionText={(choice) => (
                  <Box display="flex" alignItems="center">
                    {choice.id === 'public' && <PublicIcon color="secondary" />}
                    {choice.id === 'followers-only' && <LockPersonIcon color="secondary" />}
                    {choice.id === 'mentions-only' && <AlternateEmailIcon color="secondary" />}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {choice.name}
                    </Typography>
                  </Box>
                )}
                optionValue="id"
                sx={{
                  //hide the legend element in the fieldset to avoid empty space in the border
                  '& .MuiOutlinedInput-notchedOutline legend': {
                    display: 'none'
                  },
                  //adjust height and margin to align with buttons
                  '& .MuiOutlinedInput-notchedOutline': {
                    mt: '3px'
                  },
                  '& .MuiInputBase-root': {
                    height: '36px',
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                component="label"
                size="medium"
                sx={{ minWidth: 0 }}
                disabled={isSubmitting}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleFileChange}
                />
                <InsertPhotoIcon />
              </Button>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="medium"
              endIcon={<SendIcon />}
              disabled={isSubmitting}
            >
              {translate('app.action.send')}
            </Button>
          </Box>
        </Form>
      </Box>
    </Card>
  );
};

export default PostBlock;
