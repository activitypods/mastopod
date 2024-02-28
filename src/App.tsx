import { Admin, Resource, CustomRoutes } from "react-admin";
import { BrowserRouter, Route } from "react-router-dom";

import dataProvider from "./config/dataProvider";
import authProvider from "./config/authProvider";

import Layout from "./layout/Layout";

import PodLoginPage from "./pages/PodLoginPage/PodLoginPage";
import HomePage from "./pages/HomePage";
import ActorPage from "./pages/ActorPage/ActorPage";
import InboxPage from "./pages/InboxPage/InboxPage";
import theme from "./config/theme";
import i18nProvider from "./config/i18nProvider";

export const App = () => (
  <BrowserRouter>
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      layout={Layout}
      loginPage={PodLoginPage}
      theme={theme}
      requireAuth
    >
      <CustomRoutes noLayout>
        <Route path="/" element={<HomePage />} />
      </CustomRoutes>
      <CustomRoutes>
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="actor">
          <Route path=":username" element={<ActorPage />} />
        </Route>
      </CustomRoutes>
      <Resource name="Note" />
      <Resource name="Actor" />
      <Resource name="Profile" />
    </Admin>
  </BrowserRouter>
);
