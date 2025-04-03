import { OBJECT_TYPES } from '@semapps/activitypub-components';
import { Card, LinearProgress } from "@mui/material";
import { useGetOne } from "react-admin";
import Note from "./Note";
import Video from "./Video";
import Article from "./Article";
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
    return null;
  }
  console.log('createdObject.type', createdObject.type);
  switch (createdObject.type) {
    case OBJECT_TYPES.NOTE:
      return (
        <Card sx={{ p: 2 }}>
          <Note
            noteUri={createdObject.current || createdObject.id}
            activity={activity}
            clickOnContent={clickOnContent}
          />
        </Card>
      );
      case OBJECT_TYPES.VIDEO:
        return (
          <Card sx={{ p: 2 }}>
            <Video
              videoUri={createdObject.current || createdObject.id}
              activity={activity}
              clickOnContent={clickOnContent}
            />
          </Card>
        );
        case OBJECT_TYPES.ARTICLE:
          return (
            <Card sx={{ p: 2 }}>
              <Article
                articleUri={createdObject.current || createdObject.id}
                activity={activity}
                clickOnContent={clickOnContent}
              />
            </Card>
          );
  
    default:
      return <div>Unknown object type: {createdObject.type}</div>;
  }
};

Create.defaultProps = {
  showReplies: true,
  clickOnContent: true,
};

export default Create;
