import { Admin, Resource, CustomRoutes } from 'react-admin';
import { BrowserRouter, Route } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { PodLoginPage } from '@activitypods/react';

import dataProvider from './config/dataProvider';
import authProvider from './config/authProvider';

import Layout from './layout/Layout';

import HomePage from './pages/HomePage';
import ActorPage from './pages/ActorPage/ActorPage';
import { default as ActorPosts } from './pages/ActorPage/Posts';
import { default as ActorPostsAndReplies } from './pages/ActorPage/PostsAndReplies';
import { default as ActorFollowers } from './pages/ActorPage/Followers';
import { default as ActorFollowing } from './pages/ActorPage/Following';
import MainPage from './pages/MainPage/MainPage';
import Inbox from './pages/MainPage/Inbox';
import Outbox from './pages/MainPage/Outbox';
import Followers from './pages/MainPage/Followers';
import ActivityPage from './pages/ActivityPage/ActivityPage';
import Following from './pages/MainPage/Following';

import theme from './config/theme';
import i18nProvider from './config/i18nProvider';
import { RedirectPage } from '@activitypods/react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      cacheTime: 30 * 60 * 1000, // Cache unused data for 30 minutes.
      retry: 3
    },
    mutations: {
      onError: (error, variables, context) => {
        // TODO: Show notifications for fetch errors.
        console.error('react query mutations.onError:', error);
      }
    }
  }
});

const customPodProviders = import.meta.env.VITE_POD_PROVIDER_BASE_URL && [
  {
    'apods:baseUrl': import.meta.env.VITE_POD_PROVIDER_BASE_URL,
    'apods:area': 'Local'
  }
];

const LoginPage = props => <PodLoginPage customPodProviders={customPodProviders} {...props} />;

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
      disableTelemetry
    >
      <CustomRoutes noLayout>
        <Route path="/" element={<HomePage />} />
        <Route path="/r" element={<RedirectPage />} />
      </CustomRoutes>
      <CustomRoutes>
        <Route element={<MainPage />}>
          <Route path="inbox" element={<Inbox />} />
          <Route path="outbox" element={<Outbox />} />
          <Route path="followers" element={<Followers />} />
          <Route path="following" element={<Following />} />
        </Route>
        <Route path="/activity/:activityUri" element={<ActivityPage />} />
        <Route path="/actor/:username" element={<ActorPage />}>
          <Route index element={<ActorPosts />} />
          <Route path="replies" element={<ActorPostsAndReplies />} />
          <Route path="followers" element={<ActorFollowers />} />
          <Route path="following" element={<ActorFollowing />} />
        </Route>
      </CustomRoutes>
      <Resource name="Note" />
      <Resource name="Actor" />
      <Resource name="Profile" />
    </Admin>
  </BrowserRouter>
);
