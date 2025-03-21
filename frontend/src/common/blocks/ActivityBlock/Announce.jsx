import { useGetOne } from "react-admin";
import { Card, LinearProgress } from "@mui/material";
import { ACTIVITY_TYPES } from "@semapps/activitypub-components";
import BoostBanner from "./BoostBanner";
import Note from "./Note";

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
  } else {
    return (
      <Card sx={{ p: 2 }}>
        <BoostBanner activity={activity} />
        {boostedObject.type === ACTIVITY_TYPES.CREATE ? (
          <Note noteUri={boostedObject.object.current || boostedObject.object?.id} activity={boostedObject} />
        ) : (
          <Note noteUri={boostedObject.current || boostedObject?.id} activity={activity} />
        )}
      </Card>
    );
  }
};

export default Announce;
