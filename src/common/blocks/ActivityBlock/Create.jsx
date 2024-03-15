import { Card, LinearProgress } from "@mui/material";
import { useGetOne } from "react-admin";
import Note from "./Note";
import isObject from "isobject";

const Create = ({ activity, showReplies }) => {
  let { data: createdObject, isLoading } = useGetOne(
    "Activity",
    {
      id: activity.object,
    },
    {
      enabled: !isObject(activity.object),
    }
  );

  if (isObject(activity.object)) createdObject = activity.object;

  if (isLoading) {
    return (
      <Card sx={{ p: 4 }}>
        <LinearProgress />
      </Card>
    );
  }

  // Do not display replies
  if (!showReplies && createdObject.inReplyTo) {
    return null;
  }

  return (
    <Card sx={{ p: 2 }}>
      <Note object={createdObject} activity={activity} />
    </Card>
  );
};

Create.defaultProps = {
  showReplies: true,
};

export default Create;
