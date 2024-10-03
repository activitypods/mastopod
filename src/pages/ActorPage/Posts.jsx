import { useCollection } from "@semapps/activitypub-components";
import ActivityBlock from "../../common/blocks/ActivityBlock/ActivityBlock";
import useActorContext from "../../hooks/useActorContext";
import LoadMore from "../../common/LoadMore";

const Posts = () => {
  const actor = useActorContext();
  const {
    items: activities,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
  } = useCollection(actor?.outbox, { dereferenceItems: true });
  return (
    <>
      {activities?.map((activity) => (
        <ActivityBlock
          activity={activity}
          showReplies={false}
          key={activity.id}
        />
      ))}
      <LoadMore
        fetchNextPage={fetchNextPage}
        isLoading={isFetchingNextPage || isLoading}
      />
    </>
  );
};

export default Posts;
