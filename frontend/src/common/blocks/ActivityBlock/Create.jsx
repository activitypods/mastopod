import { Card, LinearProgress } from "@mui/material";
import { useGetOne } from "react-admin";
import Note from "./Note";
import isObject from "isobject";

const Create = ({ activity, showReplies, clickOnContent }) => {
  let {
    data: createdObject,
    isLoading,
    error,
  } = useGetOne(
    "Activity",
    {
      id: activity.object,
    },
    {
      enabled: !isObject(activity.object),
    }
  );
  console.log(
    `From Create: Activity's id ${activity.id}, Object's id ${activity.object.id ||
      activity.object.current ||
      activity.object} : isEnabled ${!isObject(activity.object)}`,
  );
  if (isObject(activity.object)) createdObject = activity.object;

  if (isLoading) {
    return (
      <Card sx={{ p: 4 }}>
        <LinearProgress />
      </Card>
    );
  } else if (error) {
    console.log(
      `Could not load object ${activity.object}. Error message: ${error.message}`
    );
    return null;
  }

  // Do not display replies
  if (!showReplies && createdObject.inReplyTo) {
    console.log(
      `Object ${activity.object.id} is a reply, but replies are not displayed`
    );
    return null;
  }

  return (
    <Card sx={{ p: 2 }}>
      <Note
        object={createdObject}
        activity={activity}
        clickOnContent={clickOnContent}
      />
    </Card>
  );
};

Create.defaultProps = {
  showReplies: true,
  clickOnContent: true,
};

export default Create;
