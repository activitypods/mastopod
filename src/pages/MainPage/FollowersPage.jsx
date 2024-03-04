import { Card } from "@mui/material";
import { SimpleList } from "react-admin";
import { CollectionList } from "@semapps/activitypub-components";

const FollowersPage = () => {
  return (
    <Card elevation={0} sx={{ mb: 3 }}>
      <CollectionList collectionUrl="followers" resource="Actor">
        <SimpleList primaryText={(record) => record.name} />
      </CollectionList>
    </Card>
  );
};

export default FollowersPage;
