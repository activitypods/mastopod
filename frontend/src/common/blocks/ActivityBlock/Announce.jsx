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
  const objectUri = boostedObject.type === ACTIVITY_TYPES.CREATE 
    ? boostedObject.object.current || boostedObject.object?.id 
    : boostedObject?.current || boostedObject?.id;
  
  const { Component, props: specificProps } = getComponentForObject(objectUri, boostedObject);


  return (
    <Card sx={{ p: 2 }}>
      <BoostBanner activity={activity} />
      <Component
        {...specificProps}
        activity={boostedObject.type === ACTIVITY_TYPES.CREATE ? boostedObject : activity}
      />
    </Card>
  );
};

export default Announce;

