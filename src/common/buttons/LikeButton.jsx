import { useCallback } from "react";
import { IconButton } from "@mui/material";
import { useNotify } from "react-admin";
import { useOutbox, ACTIVITY_TYPES } from "@semapps/activitypub-components";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const LikeButton = ({ activity, ...rest }) => {
  const outbox = useOutbox();
  const notify = useNotify();

  const like = useCallback(async () => {
    try {
      await outbox.post({
        type: ACTIVITY_TYPES.LIKE,
        actor: outbox.owner,
        object: activity.id,
        to: activity.actor,
      });
      notify("app.notification.post_liked", { type: "success" });
    } catch (e) {
      notify(e.message, "error");
    }
  }, [activity, outbox, notify]);

  return (
    <IconButton aria-label="like" onClick={like} {...rest}>
      <StarBorderIcon />
    </IconButton>
  );
};

export default LikeButton;
