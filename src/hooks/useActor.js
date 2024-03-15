import { useMemo } from "react";
import isObject from "isobject";
import { useGetOne, useGetIdentity } from "react-admin";
import { ACTOR_TYPES } from "@semapps/activitypub-components";
import { formatUsername } from "../utils";

const useActor = (actorUri) => {
  const { data: identity } = useGetIdentity();

  if (Array.isArray(actorUri)) {
    // Case of Peertube which allow to post as an actor AND a group
    // actor: [{id: 'https://framatube.org/accounts/test', type: 'Person'}, {id: 'https://framatube.org/video-channels/channel-name', type: 'Group'}]
    actorUri = actorUri.find((actor) => actor.type === ACTOR_TYPES.PERSON)?.id;
  }

  const { data: webId, isLoading: isWebIdLoading } = useGetOne(
    "Actor",
    {
      id: actorUri,
    },
    {
      enabled: !!actorUri,
      staleTime: Infinity,
    }
  );

  const { data: profile, isLoading: isProfileLoading } = useGetOne(
    "Profile",
    {
      id: webId?.url,
    },
    {
      enabled: !!webId?.url,
      staleTime: Infinity,
    }
  );

  const username = useMemo(
    () => actorUri && formatUsername(actorUri),
    [actorUri]
  );

  const name = useMemo(() => {
    if (webId) {
      const name =
        profile?.["vcard:given-name"] ||
        webId?.name ||
        webId?.["foaf:nick"] ||
        webId?.preferredUsername;

      if (isObject(name)) {
        return name?.["@value"];
      } else {
        return name;
      }
    }
  }, [webId, profile]);

  const image = useMemo(() => {
    let image = profile?.["vcard:photo"] || webId?.icon;

    if (Array.isArray(image)) {
      // Select the largest image
      image.sort((a, b) => b?.height - a?.height);
      image = image[0];
    }

    return image?.url || image;
  }, [webId, profile]);

  return {
    ...webId,
    uri: actorUri,
    isLoggedUser: actorUri === identity?.id,
    name,
    image,
    username,
    isLoading: isWebIdLoading || isProfileLoading,
  };
};

export default useActor;
