import { useMemo } from "react";
import isObject from "isobject";
import { Box, Card, Avatar, Typography, LinearProgress } from "@mui/material";
import { Link, useGetOne } from "react-admin";
import LikeButton from "../../buttons/LikeButton";
import BoostButton from "../../buttons/BoostButton";
import BoostBanner from "./BoostBanner";
import ReplyButton from "../../buttons/ReplyButton";
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

  console.log("activity", activity);

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
      boostedActivity?.object?.contentMap ||
      boostedActivity?.content ||
      boostedActivity?.contentMap ||
      activity.content ||
      activity.contentMap ||
      activity.object?.content ||
      activity.object?.contentMap;

    // If we have a contentMap, take first value
    if (isObject(content)) {
      content = Object.values(content)?.[0];
    }

    // Replace mentions links to local actor links
    // TODO use a react-router Link to avoid page reload
    arrayOf(activity?.object?.tag || activity?.tag)
      .filter((tag) => tag.type === "Mention")
      .forEach((mention) => {
        content = content.replaceAll(mention.href, `/actor/${mention.name}`);
      });

    return content;
  }, [boostedActivity, activity]);

  const image = useMemo(() => {
    let image =
      boostedActivity?.attachment ||
      boostedActivity?.icon ||
      activity?.attachment ||
      activity?.icon;

    if (Array.isArray(image)) {
      // Select the largest image
      image.sort((a, b) => b?.height - a?.height);
      image = image[0];
    }

    return image?.url;
  }, [boostedActivity, activity]);

  if (actor.isLoading || !content) {
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
        <Link to={`/actor/${actor?.username}`}>
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
        <Link
          to={`/activity/${encodeURIComponent(
            boostedActivity?.id || activity?.id
          )}`}
        >
          <Typography
            sx={{ color: "black" }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Link>
        {image && <img src={image} style={{ width: "100%", marginTop: 10 }} />}
      </Box>
      <Box pl={8} pt={2} display="flex" justifyContent="space-between">
        <ReplyButton activity={boostedActivity || activity} />
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
