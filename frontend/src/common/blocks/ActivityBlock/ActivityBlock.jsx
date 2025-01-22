import { ACTIVITY_TYPES, OBJECT_TYPES } from '@semapps/activitypub-components';
import Create from './Create';
import Announce from './Announce';

const ActivityBlock = ({ activity, showReplies, clickOnContent }) => {
  switch (activity.type) {
    case ACTIVITY_TYPES.ANNOUNCE:
      console.log("From ActivityBlock: Displaying announce", activity.id);
      return <Announce activity={activity} />;

    case ACTIVITY_TYPES.CREATE:
      console.log("From ActivityBlock: Displaying create", activity.id);
      return <Create activity={activity} showReplies={showReplies} clickOnContent={clickOnContent} />;

    case OBJECT_TYPES.NOTE:
      console.log("From ActivityBlock: Displaying note", activity.id);
      return <Create activity={{ object: activity }} showReplies={showReplies} clickOnContent={clickOnContent} />;

    default:
      // console.debug(
      //   `Activities or objects of type ${activity.type} are not displayed`,
      //   activity
      // );
      return null;
  }
};

ActivityBlock.defaultProps = {
  showReplies: true,
  clickOnContent: true
};

export default ActivityBlock;
