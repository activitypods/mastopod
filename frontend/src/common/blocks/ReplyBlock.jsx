import { useGetOne } from "react-admin";
import ActivityBlock from "./ActivityBlock/ActivityBlock";

const ReplyBlock = ({ activityUri }) => {
  const { data: activity } = useGetOne(
    "Activity",
    { id: activityUri },
    { enabled: !!activityUri, staleTime: Infinity }
  );

  if (!activity) return null;

  return <ActivityBlock activity={activity} showReplies={true} />;
};

export default ReplyBlock;
