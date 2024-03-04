import { useCollection } from "@semapps/activitypub-components";
import ActivityBlock from "../../common/blocks/ActivityBlock/ActivityBlock";
import useActorContext from "../../hooks/useActorContext";

const Posts = () => {
  const actor = useActorContext();
  const { items: activities } = useCollection(actor?.outbox);
  return activities?.map((activity) => (
    <ActivityBlock activity={activity} showReplies={false} key={activity.id} />
  ));
};

export default Posts;
