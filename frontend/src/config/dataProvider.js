import urlJoin from 'url-join';
import { dataProvider, configureUserStorage, fetchAppRegistration } from '@semapps/semantic-data-provider';
import dataModels from './dataModels';

const { origin: backendOrigin } = new URL(import.meta.env.VITE_BACKEND_URL);

export default dataProvider({
  resources: dataModels,
  jsonContext: ['https://www.w3.org/ns/activitystreams', urlJoin(backendOrigin, '.well-known/context.jsonld')],
  returnFailedResources: true,
  plugins: [configureUserStorage(), fetchAppRegistration()]
});
