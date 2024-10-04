import urlJoin from 'url-join';
import { useCallback } from "react";
import { useGetIdentity } from "react-admin";

const useOpenExternalApp = () => {
  const { identity } = useGetIdentity();
  return useCallback((type, uri, mode) => {
    if (identity?.id) {
      const searchParams = new URLSearchParams();
      if (type) searchParams.set('type', type);
      if (uri) searchParams.set('uri', uri);
      if (mode) searchParams.set('mode', mode);
      return urlJoin(identity.id, 'openApp') + '?' + searchParams.toString();
    }
  }, [identity]);
};

export default useOpenExternalApp;
