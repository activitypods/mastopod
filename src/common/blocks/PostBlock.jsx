import {
  Form,
  TextInput,
  useNotify,
  useTranslate,
  useGetIdentity,
} from "react-admin";
import { Card, Box, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import {
  useOutbox,
  OBJECT_TYPES,
  PUBLIC_URI,
} from "@semapps/activitypub-components";
import { useCallback } from "react";

const PostBlock = () => {
  const notify = useNotify();
  const outbox = useOutbox();
  const translate = useTranslate();
  const { data: identity } = useGetIdentity();

  const onSubmit = useCallback(
    async (values) => {
      try {
        await outbox.post({
          type: OBJECT_TYPES.NOTE,
          attributedTo: outbox.owner,
          content: values.content,
          to: [PUBLIC_URI, identity?.webIdData?.followers],
        });
        notify("app.notification.message_sent", { type: "success" });
      } catch (e) {
        notify("app.notification.message_send_error", {
          type: "error",
          messageArgs: { error: e.message },
        });
      }
    },
    [outbox, identity, notify]
  );

  return (
    <Card elevation={0} sx={{ mb: 3 }}>
      <Box p={2}>
        <Form onSubmit={onSubmit}>
          <TextInput
            source="content"
            label={translate("app.input.message")}
            margin="dense"
            fullWidth
            multiline
            minRows={4}
            sx={{ m: 0, mb: -2 }}
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
