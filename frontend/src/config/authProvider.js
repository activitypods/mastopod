import { authProvider } from '@semapps/auth-provider';
import dataProvider from './dataProvider';

export default authProvider({
  dataProvider,
  authType: 'solid-oidc',
  checkPermissions: true,
  allowAnonymous: false,
  clientId: import.meta.env.VITE_BACKEND_CLIENT_ID
});
