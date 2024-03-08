import { useMemo } from "react";
import { Box, Card, Avatar, Typography, LinearProgress } from "@mui/material";
import { Link, useGetOne } from "react-admin";
import LikeButton from "../../buttons/LikeButton";
import BoostButton from "../../buttons/BoostButton";
import BoostBanner from "./BoostBanner";
import ReplyIcon from "@mui/icons-material/Reply";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import RelativeDate from "../../RelativeDate";
import { ACTIVITY_TYPES, OBJECT_TYPES } from "@semapps/activitypub-components";
import useActor from "../../../hooks/useActor";
import { arrayOf } from "../../../utils";

const ActivityBlock = ({ activity, showReplies }) => {
  if (
    activity.type !== ACTIVITY_TYPES.CREATE &&
    activity.type !== ACTIVITY_TYPES.ANNOUNCE &&
    activity.type !== OBJECT_TYPES.NOTE
  ) {
    return null;
  }

  let boostedActivity;

  if (activity.type === ACTIVITY_TYPES.CREATE) {
    if (!showReplies && activity.object.inReplyTo) {
      return null;
    }
  } else if (activity.type === ACTIVITY_TYPES.ANNOUNCE) {
    ({ data: boostedActivity } = useGetOne("Activity", {
      id: activity.object,
    }));
  }

  const actorUri =
    boostedActivity?.object?.attributedTo ||
    boostedActivity?.attributedTo ||
    activity.attributedTo ||
    activity.object?.attributedTo;

  const actor = useActor(actorUri);

  const content = useMemo(() => {
    let content =
      boostedActivity?.object?.content ||
      boostedActivity?.content ||
      activity.content ||
      activity.object?.content;

    // Replace mentions links to local actor links
    // TODO use a react-router Link to avoid page reload
    arrayOf(activity?.object?.tag || activity?.tag)
      .filter((tag) => tag.type === "Mention")
      .forEach((mention) => {
        content = content.replaceAll(mention.href, `/actor/${mention.name}`);
      });

    return content;
  }, [boostedActivity, activity]);

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
        <Link to={`/actor?username=${encodeURIComponent(actor?.username)}`}>
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
          <Typography
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              color: "black",
              pr: 8,
            }}
          >
            <strong>{actor?.name}</strong>{" "}
            <Typography component="span" sx={{ color: "grey" }}>
              <em>{actor?.username}</em>
            </Typography>
          </Typography>
        </Link>

        {activity?.published && (
          <Box sx={{ position: "absolute", top: 0, right: 0 }}>
            <RelativeDate
              date={boostedActivity?.published || activity?.published}
              sx={{ fontSize: 13, color: "grey" }}
            />
          </Box>
        )}

        {/* <Link
          to={`/activity/${encodeURIComponent(
            boostedActivity?.id || activity?.id
          )}`}
        > */}
        <Typography
          sx={{ color: "black" }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        {/* </Link> */}

        {boostedActivity?.attachment && (
          <img
            src={boostedActivity?.attachment.url}
            style={{ width: "100%" }}
          />
        )}
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

export default ActivityBlock;
