import { useCallback, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { Form, TextInput, useNotify, useTranslate } from 'react-admin';
import SendIcon from '@mui/icons-material/Send';
import { useOutbox, OBJECT_TYPES } from '@semapps/activitypub-components';

const SendDirectMessageButton = ({ actorUri, children, ...rest }) => {
  const [showDialog, setShowDialog] = useState(false);
  const translate = useTranslate();
  const notify = useNotify();
  const outbox = useOutbox();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = useCallback(async values => {
    setIsSubmitting(true);
    try {
      await outbox.post({
        type: OBJECT_TYPES.NOTE,
        attributedTo: outbox.owner,
        content: values.content,
        to: [actorUri]
      });
      notify('app.notification.message_sent', { type: 'success' });
      setShowDialog(false);
    } catch (e) {
      notify('app.notification.message_send_error', { type: 'error', messageArgs: { error: e.message } });
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <Box>
      <Button
        variant="contained"
        onClick={() => setShowDialog(true)}
        color="secondary"
        startIcon={<SendIcon />}
      >
        {translate('app.action.message')}
      </Button>
      <Dialog fullWidth open={showDialog} onClose={() => setShowDialog(false)}>
        <Backdrop
          sx={{
            color: '#fff',
            position: 'absolute',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            borderRadius: 1
          }}
          open={isSubmitting}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Form onSubmit={onSubmit}>
          <DialogTitle>{translate('app.action.sendDirectMessage')}</DialogTitle>
            <DialogContent>
                <TextInput
                  source="content"
                  label={translate('app.input.message')}
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  multiline
                  minRows={4}
                />
            </DialogContent>
            <DialogActions>
              <Button type="submit" variant="contained" color="secondary" size="medium" endIcon={<SendIcon />}>
                {translate('app.action.send')}
              </Button>
              <Button onClick={() => setShowDialog(false)} >
                {translate('ra.action.cancel')}
              </Button>
            </DialogActions>
        </Form>
      </Dialog>
    </Box>
  );
};

export default SendDirectMessageButton;
