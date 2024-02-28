import { dataProvider } from "@semapps/semantic-data-provider";
import ontologies from "./ontologies.json";
import dataServers from "./dataServers";
import dataModels from "./dataModels";

export default dataProvider({
  dataServers,
  resources: dataModels,
  ontologies,
  jsonContext: "https://activitypods.org/context.json",
  returnFailedResources: true,
});
