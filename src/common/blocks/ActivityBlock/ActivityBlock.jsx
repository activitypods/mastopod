import { Card } from "@mui/material";
import { ACTIVITY_TYPES, OBJECT_TYPES } from "@semapps/activitypub-components";
import Create from "./Create";
import Announce from "./Announce";
import Note from "./Note";

const ActivityBlock = ({ activity, showReplies }) => {
  if (activity.type === ACTIVITY_TYPES.ANNOUNCE) {
    return <Announce activity={activity} />;
  } else if (activity.type === ACTIVITY_TYPES.CREATE) {
    return <Create activity={activity} showReplies={showReplies} />;
  } else if (activity.type === OBJECT_TYPES.NOTE) {
    return <Create activity={{ object: activity }} showReplies={showReplies} />;
  } else {
    console.info(
      `Activities or objects of type ${activity.type} are not displayed`,
      activity
    );
  }
};

ActivityBlock.defaultProps = {
  showReplies: true,
};

export default ActivityBlock;
