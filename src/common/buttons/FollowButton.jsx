import { useCallback } from "react";
import { Button } from "@mui/material";
import { useNotify } from "react-admin";
import { useOutbox, ACTIVITY_TYPES } from "@semapps/activitypub-components";

const FollowButton = ({ actorUri, children, ...rest }) => {
  const outbox = useOutbox();
  const notify = useNotify();

  const follow = useCallback(async () => {
    try {
      await outbox.post({
        type: ACTIVITY_TYPES.FOLLOW,
        actor: outbox.owner,
        object: actorUri,
        to: actorUri,
      });
    } catch (e) {
      notify(e.message, "error");
    }
  }, [actorUri, outbox, notify]);

  return (
    <Button variant="contained" onClick={follow} {...rest}>
      {children}
    </Button>
  );
};

FollowButton.defaultProps = {
  children: "Follow",
};

export default FollowButton;
