import { Box, Card, Avatar, Typography, LinearProgress } from "@mui/material";
import { useGetOne } from "react-admin";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import LikeButton from "../../buttons/LikeButton";
import BoostButton from "../../buttons/BoostButton";
import BoostBanner from "./BoostBanner";
import ReplyIcon from "@mui/icons-material/Reply";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { ACTIVITY_TYPES } from "@semapps/activitypub-components";
import useActor from "../../../hooks/useActor";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

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

  const actor = useActor(actorUri);

  if (actor.isLoading) {
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
          src={actor?.image}
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
          <em style={{ color: "grey" }}>{actor?.username}</em>
        </Typography>

        {activity?.published && (
          <Box sx={{ position: "absolute", top: 0, right: 0 }}>
            <Typography
              sx={{ fontSize: 12, color: "grey" }}
              title={dayjs(activity?.published).format("LLL")}
            >
              {dayjs().from(dayjs(activity?.published), true)}
            </Typography>
          </Box>
        )}

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
