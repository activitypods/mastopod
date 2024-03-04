import { useGetOne } from "react-admin";
import { formatUsername } from "../utils";
import { useMemo } from "react";

const useActor = (actorUri) => {
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

  return {
    uri: actorUri,
    name:
      profile?.["vcard:given-name"] ||
      webId?.name ||
      webId?.["foaf:nick"] ||
      webId?.preferredUsername,
    image: profile?.["vcard:photo"] || webId?.icon?.url,
    username,
    isLoading: isWebIdLoading || isProfileLoading,
  };
};

export default useActor;
