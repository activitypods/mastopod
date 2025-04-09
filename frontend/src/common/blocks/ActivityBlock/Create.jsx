import { OBJECT_TYPES } from '@semapps/activitypub-components';
import { Card, LinearProgress } from "@mui/material";
import { useGetOne } from "react-admin";
import isObject from "isobject";
import { getComponentForObject } from "../../../utils";
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

  const objectUri = createdObject.current || createdObject.id;

  const config = getComponentForObject(objectUri, createdObject);

  if (!config) {
    return null;
  }

  const { Component, props: specificProps } = config;

  return (
    <Card sx={{ p: 2 }}>
      <Component
        {...specificProps}
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
