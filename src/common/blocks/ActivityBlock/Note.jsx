import { useMemo } from "react";
import isObject from "isobject";
import { Box, Avatar, Typography, MenuItem } from "@mui/material";
import { Link } from "react-admin";
import LikeButton from "../../buttons/LikeButton";
import BoostButton from "../../buttons/BoostButton";
import ReplyButton from "../../buttons/ReplyButton";
import RelativeDate from "../../RelativeDate";
import useActor from "../../../hooks/useActor";
import { arrayOf } from "../../../utils";
import MoreButton from "../../buttons/MoreButton";

const Note = ({ object, activity }) => {
  const actorUri = object?.attributedTo;

  const actor = useActor(actorUri);

  const content = useMemo(() => {
    let content = object.content || object.contentMap;

    // If we have a contentMap, take first value
    if (isObject(content)) {
      content = Object.values(content)?.[0];
    }

    // Replace mentions links to local actor links
    // TODO use a react-router Link to avoid page reload
    arrayOf(object.tag || activity?.tag)
      .filter((tag) => tag.type === "Mention")
      .forEach((mention) => {
        content = content.replaceAll(mention.href, `/actor/${mention.name}`);
      });

    return content;
  }, [object, activity]);

  const image = useMemo(() => {
    let image = object.attachment || object.icon;

    if (Array.isArray(image)) {
      // Select the largest image
      image.sort((a, b) => b?.height - a?.height);
      image = image[0];
    }

    return image?.url;
  }, [object]);

  return (
    <>
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

        {object?.published && (
          <Box sx={{ position: "absolute", top: 0, right: 0 }}>
            <RelativeDate
              date={object?.published}
              sx={{ fontSize: 13, color: "grey" }}
            />
          </Box>
        )}
        <Link to={`/activity/${encodeURIComponent(activity?.id || object.id)}`}>
          <Typography
            sx={{ color: "black" }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Link>
        {image && <img src={image} style={{ width: "100%", marginTop: 10 }} />}
      </Box>
      <Box pl={8} pt={2} display="flex" justifyContent="space-between">
        <ReplyButton activity={object} />
        <BoostButton activity={object} />
        <LikeButton activity={object} />
        <MoreButton>
          <MenuItem onClick={(event) => console.log("event", event)}>
            Unfollow
          </MenuItem>
        </MoreButton>
      </Box>
    </>
  );
};

export default Note;
