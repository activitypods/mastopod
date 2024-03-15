import { useRef, useEffect } from "react";
import {
  Form,
  TextInput,
  useNotify,
  useTranslate,
  useGetIdentity,
  useRedirect,
} from "react-admin";
import { useLocation } from "react-router-dom";
import { Card, Box, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import {
  useOutbox,
  OBJECT_TYPES,
  PUBLIC_URI,
} from "@semapps/activitypub-components";
import { useCallback } from "react";

const PostBlock = ({ inReplyTo, mention }) => {
  const notify = useNotify();
  const redirect = useRedirect();
  const inputRef = useRef(null);
  const outbox = useOutbox();
  const translate = useTranslate();
  const { hash } = useLocation();
  const { data: identity } = useGetIdentity();

  // Doesn't work
  useEffect(() => {
    if (hash === "#reply" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hash, inputRef.current]);

  const onSubmit = useCallback(
    async (values) => {
      try {
        const activityUri = await outbox.post({
          type: OBJECT_TYPES.NOTE,
          attributedTo: outbox.owner,
          content: values.content,
          inReplyTo,
          to: mention
            ? [PUBLIC_URI, identity?.webIdData?.followers, mention.uri]
            : [PUBLIC_URI, identity?.webIdData?.followers],
        });
        notify("app.notification.message_sent", { type: "success" });
        if (inReplyTo) {
          redirect(`/activity/${encodeURIComponent(activityUri)}`);
        }
      } catch (e) {
        notify("app.notification.message_send_error", {
          type: "error",
          messageArgs: { error: e.message },
        });
      }
    },
    [outbox, identity, notify, mention, inReplyTo, redirect]
  );

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
          <Box display="flex" flexDirection="column" alignItems="flex-end">
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
