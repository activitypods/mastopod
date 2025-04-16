import { useGetOne } from "react-admin";
import { Card, LinearProgress } from "@mui/material";
import { ACTIVITY_TYPES } from "@semapps/activitypub-components";
import BoostBanner from "./BoostBanner";
import { getComponentForObject } from "../../../utils";

const Announce = ({ activity }) => {
  const {
    data: boostedObject,
    isLoading,
    error,
  } = useGetOne("Activity", {
    id: activity.object,
  });

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
  }

  let objectUri;
  let boostedActivity;
  // If the boosted object is a Create activity
  if (boostedObject.type === ACTIVITY_TYPES.CREATE) {
    //Then we need to get the object from its object property
    objectUri = boostedObject.object.current || boostedObject.object?.id;
    //and the boosted activity is the Create activity
    boostedActivity = boostedObject;
  } else {
    //otherwise, the object is the boosted object itself
    objectUri = boostedObject?.current || boostedObject?.id;
    //and the boosted activity is the activity itself
    boostedActivity = activity;
  }
    
  const { Component, props: specificProps } = getComponentForObject(objectUri, boostedObject);

  return (
    <Card sx={{ p: 2 }}>
      <BoostBanner activity={activity} />
      <Component
        {...specificProps}
        activity={boostedActivity}
      />
    </Card>
  );
};

export default Announce;

