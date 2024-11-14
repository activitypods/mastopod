import { useRef, useEffect, useState } from "react";
import {
  Form,
  TextInput,
  useNotify,
  useTranslate,
  useGetIdentity,
  useRedirect,
  useDataProvider
} from "react-admin";
import { useLocation } from "react-router-dom";
import { Card, Box, Button, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import DeleteIcon from '@mui/icons-material/Delete';
import {
  useOutbox,
  OBJECT_TYPES,
  PUBLIC_URI,
} from "@semapps/activitypub-components";
import { useCallback } from "react";

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

  // Doesn't work
  useEffect(() => {
    if (hash === "#reply" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hash, inputRef.current]);

  const uploadImage = useCallback(async (file) => {
    try {
      let imageUrl = await dataProvider.uploadFile(file);
      return imageUrl;
    } catch (error) {
      console.error(error);
      throw new Error(translate("app.notification.image_upload_error"));
    }
  }, [dataProvider, translate]);

  const handleAttachments = useCallback(async () =>  {
    const attachments = await Promise.all(
      imageFiles.map(async (file) => {
        const imageUrl = await uploadImage(file.file);
        return {
          type: "Image",
          mediaType: file.type,
          url: imageUrl,
        };
      })
    );
    return attachments;
  }, [imageFiles, uploadImage]);

  const clearForm = useCallback(() =>  {
    // still looking for a way to clear the actual form
    // Clearing local URL for image preview (avoid memory leaks)
    imageFiles.forEach((image) => URL.revokeObjectURL(image.preview));
    setImageFiles([]);
  }, []);

  const onSubmit = useCallback(
    async (values, { reset }) => {
      try {
        const activity = {
          type: OBJECT_TYPES.NOTE,
          attributedTo: outbox.owner,
          content: values.content,
          inReplyTo,
          to: mention
            ? [PUBLIC_URI, identity?.webIdData?.followers, mention.uri]
            : [PUBLIC_URI, identity?.webIdData?.followers],
        };

        let attachments = await handleAttachments();
        if (attachments.length > 0) {
          activity.attachment = attachments;
        }

        const activityUri = await outbox.post(activity);
        notify("app.notification.message_sent", { type: "success" });
        clearForm();

        if (inReplyTo) {
          redirect(`/activity/${encodeURIComponent(activityUri)}`);
        }
      } catch (e) {
        notify("app.notification.activity_send_error", {
          type: "error",
          messageArgs: { error: e.message },
        });
      }
    },
    [outbox, identity, notify, mention, inReplyTo, redirect]
  );

  const handleFileChange = useCallback((event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
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
      <Box p={2}>
        <Form onSubmit={onSubmit}>
          <TextInput
            inputRef={inputRef}
            source="content"
            label={
              inReplyTo
                ? translate("app.input.reply")
                : translate("app.input.message")
            }
            margin="dense"
            fullWidth
            multiline
            minRows={4}
            sx={{ m: 0, mb: -2 }}
            autoFocus={hash === "#reply"}
          />

          {/*Preview of selected pictures*/}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              mt: 1,
            }}
          >
            {imageFiles.map((image, index) => (
              <Box
                key={image.preview}
                sx={{
                  height: 80,
                  borderRadius: 1,
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <img
                  src={image.preview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
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
                      color: '#ff5252',
                    },
                  }}
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Button
              variant="contained"
              color="primary"
              component="label"
              size="medium"
              sx={{
                minWidth: 0
              }}
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
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="medium"
              endIcon={<SendIcon />}
            >
              {translate("app.action.send")}
            </Button>
          </Box>
        </Form>
      </Box>
    </Card>
  );
};

export default PostBlock;
