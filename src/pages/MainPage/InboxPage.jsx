import { useCollection } from "@semapps/activitypub-components";
import ActivityBlock from "../../common/blocks/ActivityBlock/ActivityBlock";
import PostBlock from "../../common/blocks/PostBlock";

const InboxPage = () => {
  const { items: activities } = useCollection("inbox");
  return (
    <>
      <PostBlock />
      {activities?.map((activity) => (
        <ActivityBlock activity={activity} key={activity.id} />
      ))}
    </>
  );
};

export default InboxPage;
