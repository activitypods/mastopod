import { Admin, Resource, CustomRoutes } from "react-admin";
import { BrowserRouter, Route } from "react-router-dom";
import { QueryClient } from "react-query";

import dataProvider from "./config/dataProvider";
import authProvider from "./config/authProvider";

import Layout from "./layout/Layout";

import PodLoginPage from "./pages/PodLoginPage/PodLoginPage";
import HomePage from "./pages/HomePage";
import ActorPage from "./pages/ActorPage/ActorPage";
import MainPage from "./pages/MainPage/MainPage";
import InboxPage from "./pages/MainPage/InboxPage";
import OutboxPage from "./pages/MainPage/OutboxPage";
import FollowersPage from "./pages/MainPage/FollowersPage";
import theme from "./config/theme";
import i18nProvider from "./config/i18nProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const customPodProviders = import.meta.env.VITE_POD_PROVIDER_DOMAIN_NAME && [
  {
    "apods:domainName": import.meta.env.VITE_POD_PROVIDER_DOMAIN_NAME,
    "apods:area": "Local",
  },
];

const LoginPage = (props) => (
  <PodLoginPage customPodProviders={customPodProviders} {...props} />
);

export const App = () => (
  <BrowserRouter>
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      queryClient={queryClient}
      layout={Layout}
      loginPage={LoginPage}
      theme={theme}
      requireAuth
    >
      <CustomRoutes noLayout>
        <Route path="/" element={<HomePage />} />
      </CustomRoutes>
      <CustomRoutes>
        <Route element={<MainPage />}>
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/outbox" element={<OutboxPage />} />
          <Route path="/followers" element={<FollowersPage />} />
        </Route>
        <Route path="/actor" element={<ActorPage />} />
      </CustomRoutes>
      <Resource name="Note" />
      <Resource name="Actor" />
      <Resource name="Profile" />
    </Admin>
  </BrowserRouter>
);
