import { authProvider } from "@semapps/auth-provider";
import dataProvider from "./dataProvider";

export default authProvider({
  dataProvider,
  authType: "pod",
  allowAnonymous: false,
  checkPermissions: true,
});
