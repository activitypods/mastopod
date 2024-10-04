import urlJoin from 'url-join';
import { dataProvider } from '@semapps/semantic-data-provider';
import ontologies from './ontologies.json';
import dataServers from './dataServers';
import dataModels from './dataModels';

const { origin: backendOrigin } = new URL(import.meta.env.VITE_BACKEND_URL);

export default dataProvider({
  dataServers,
  resources: dataModels,
  ontologies,
  jsonContext: ['https://www.w3.org/ns/activitystreams', urlJoin(backendOrigin, '.well-known/context.jsonld')],
  returnFailedResources: true
});
