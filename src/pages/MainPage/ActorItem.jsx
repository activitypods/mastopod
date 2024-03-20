import { useCallback, useState } from "react";
import useActor from "../../hooks/useActor";
import {
  Avatar,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { ACTIVITY_TYPES, useOutbox } from "@semapps/activitypub-components";
import { useNotify } from "react-admin";

const ActorItem = ({ actorUri, unfollowButton }) => {
  const actor = useActor(actorUri);
  const outbox = useOutbox();
  const notify = useNotify();
  const [visible, setVisible] = useState(true);

  const unfollow = useCallback(async () => {
    try {
      await outbox.post({
        type: ACTIVITY_TYPES.UNDO,
        actor: outbox.owner,
        object: {
          type: ACTIVITY_TYPES.FOLLOW,
          object: actorUri,
          actor: outbox.owner,
        },
        to: actorUri,
      });
      setVisible(false);
      notify("app.notification.actor_unfollowed", { type: "success" });
    } catch (e) {
      notify("app.notification.activity_send_error", {
        type: "error",
        messageArgs: { error: e.message },
      });
    }
  }, [outbox, actorUri, notify, setVisible]);

  if (!visible) return null;

  return (
    <ListItem
      sx={{ p: 0 }}
      secondaryAction={
        unfollowButton && (
          <IconButton edge="end" onClick={unfollow} sx={{ pr: 2 }}>
            <DeleteIcon />
          </IconButton>
        )
      }
    >
      <ListItemButton component={Link} to={`/actor/${actor.username}`}>
        {actor.isLoading ? (
          <Skeleton variant="circular" width={40} height={40} />
        ) : (
          <ListItemAvatar>
            <Avatar alt={actor.name} src={actor.image} />
          </ListItemAvatar>
        )}
        {actor.isLoading ? (
          <Box p={1} sx={{ width: "100%" }}>
            <Skeleton variant="text" />
            <Skeleton variant="text" />
          </Box>
        ) : (
          <ListItemText primary={actor.name} secondary={actor.username} />
        )}
      </ListItemButton>
    </ListItem>
  );
};

ActorItem.defaultProps = {
  unfollowButton: false,
};

export default ActorItem;
