import { useCallback } from "react";
import { Button } from "@mui/material";
import { useNotify, useTranslate } from "react-admin";
import {
  useOutbox,
  useCollection,
  ACTIVITY_TYPES,
} from "@semapps/activitypub-components";

const FollowButton = ({ actorUri, children, ...rest }) => {
  const outbox = useOutbox();
  const notify = useNotify();
  const translate = useTranslate();
  const { items: following, addItem, removeItem } = useCollection("following");

  const follow = useCallback(async () => {
    try {
      await outbox.post({
        type: ACTIVITY_TYPES.FOLLOW,
        actor: outbox.owner,
        object: actorUri,
        to: actorUri,
      });
      notify("app.notification.actor_followed", { type: "success" });
    } catch (e) {
      notify(e.message, { type: "error" });
    }
    addItem(actorUri);
  }, [actorUri, outbox, notify, addItem]);

  const unfollow = useCallback(async () => {
    try {
      await outbox.post({
        type: ACTIVITY_TYPES.UNDO,
        actor: outbox.owner,
        object: {
          type: ACTIVITY_TYPES.FOLLOW,
          object: actorUri,
        },
        to: actorUri,
      });
      notify("app.notification.actor_unfollowed", { type: "success" });
    } catch (e) {
      notify(e.message, { type: "error" });
    }
    removeItem(actorUri);
  }, [actorUri, outbox, notify, removeItem]);

  return following?.includes(actorUri) ? (
    <Button variant="contained" onClick={unfollow} {...rest}>
      {translate("app.action.unfollow")}
    </Button>
  ) : (
    <Button variant="contained" onClick={follow} {...rest}>
      {translate("app.action.follow")}
    </Button>
  );
};

export default FollowButton;
