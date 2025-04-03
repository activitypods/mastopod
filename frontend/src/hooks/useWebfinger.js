import { useCallback } from 'react';
import { fetchUtils } from 'react-admin';
import { useDataProvider } from 'react-admin';
const useWebfinger = () => {
  const dataProvider = useDataProvider();
  // Post an activity to the logged user's outbox and return its URI
  const fetch = useCallback(async id => {
    // eslint-disable-next-line
    const [_, username, host] = id.split('@');
    if (host) {
      const protocol = host.includes(':') ? 'http' : 'https'; // If the host has a port, we are most likely on localhost
      const webfingerUrl = `${protocol}://${host}/.well-known/webfinger?resource=acct:${username}@${host}`;

      try {
        const { json } = await dataProvider.fetch(webfingerUrl);

        const link = json.links.find(l => l.type === 'application/activity+json');

        return link ? link.href : null;
      } catch (e) {
        return null;
      }
    } else {
      return null;
    }
  }, [dataProvider]);

  return { fetch };
};

export default useWebfinger;
