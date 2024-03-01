import { Box, Card, Avatar, Typography, LinearProgress } from "@mui/material";
import { useGetOne } from "react-admin";
import { formatUsername } from "../../../utils";
import LikeButton from "../../buttons/LikeButton";
import BoostButton from "../../buttons/BoostButton";
import BoostBanner from "./BoostBanner";
import ReplyIcon from "@mui/icons-material/Reply";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { ACTIVITY_TYPES } from "@semapps/activitypub-components";

const Activity = ({ activity }) => {
  if (
    activity.type !== ACTIVITY_TYPES.CREATE &&
    activity.type !== ACTIVITY_TYPES.ANNOUNCE
  ) {
    return null;
  }

  let boostedActivity;

  if (activity.type === ACTIVITY_TYPES.ANNOUNCE) {
    ({ data: boostedActivity } = useGetOne("Activity", {
      id: activity.object,
    }));
  }

  const actorUri =
    boostedActivity?.object?.attributedTo ||
    boostedActivity?.attributedTo ||
    activity.object?.attributedTo;

  const { data: actor } = useGetOne(
    "Actor",
    {
      id: actorUri,
    },
    {
      enabled: !!actorUri,
    }
  );

  if (!actor) {
    return (
      <Card elevation={0} sx={{ mb: 3, p: 4 }}>
        <LinearProgress />
      </Card>
    );
  }

  return (
    <Card elevation={0} sx={{ mb: 3, p: 2 }}>
      {boostedActivity && <BoostBanner activity={activity} />}
      <Box pl={8} sx={{ position: "relative" }}>
        <Avatar
          src={actor?.icon?.url}
          alt={actor?.name}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 50,
            height: 50,
          }}
        />
        <Typography>
          <strong>{actor?.name}</strong>{" "}
          <em style={{ color: "grey" }}>{formatUsername(actor?.id)}</em>
        </Typography>

        <Typography
          dangerouslySetInnerHTML={{
            __html:
              boostedActivity?.object?.content ||
              boostedActivity?.content ||
              activity.object?.content,
          }}
        />
      </Box>
      <Box pl={8} pt={2} display="flex" justifyContent="space-between">
        <ReplyIcon sx={{ color: "grey" }} />
        <BoostButton
          activity={boostedActivity?.object || boostedActivity || activity}
        />
        <LikeButton activity={boostedActivity || activity} />
        <MoreHorizIcon sx={{ color: "grey" }} />
      </Box>
    </Card>
  );
};

export default Activity;
