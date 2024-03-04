import useActor from "../../hooks/useActor";
import {
  Avatar,
  Box,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
} from "@mui/material";
import { Link } from "react-router-dom";

const ActorItem = ({ actorUri }) => {
  const actor = useActor(actorUri);
  return (
    <ListItem sx={{ p: 0 }}>
      <ListItemButton
        component={Link}
        to={`/actor?username=${encodeURIComponent(actor.username)}`}
      >
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

export default ActorItem;
