import { useGetOne } from "react-admin";
import { Card, LinearProgress } from "@mui/material";
import { ACTIVITY_TYPES } from "@semapps/activitypub-components";
import BoostBanner from "./BoostBanner";
import Note from "./Note";
const Announce = ({ activity }) => {
  const { data: boostedObject, isLoading } = useGetOne("Activity", {
    id: activity.object,
  });

  if (isLoading) {
    return (
      <Card sx={{ p: 4 }}>
        <LinearProgress />
      </Card>
    );
  } else {
    return (
      <Card sx={{ p: 2 }}>
        <BoostBanner activity={activity} />
        {boostedObject.type === ACTIVITY_TYPES.CREATE ? (
          <Create activity={boostedObject} />
        ) : (
          <Note object={boostedObject} activity={activity} />
        )}
      </Card>
    );
  }
};

export default Announce;
