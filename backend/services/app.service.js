const urlJoin = require('url-join');
const { AppService } = require('@activitypods/app');
const CONFIG = require('../config/config');

// For documentation, see: https://docs.activitypods.org/app-framework/backend/application-registration/
module.exports = {
  mixins: [AppService],
  settings: {
    baseUrl: CONFIG.HOME_URL,
    app: {
      name: CONFIG.APP_NAME,
      description: {
        en: 'A Mastodon-compatible app that saves all data in a Pod',
        fr: 'Une appli compatible avec Mastodon qui enregistre tout dans votre Pod'
      },
      thumbnail: urlJoin(CONFIG.FRONT_URL, 'logo192.png'),
      frontUrl: CONFIG.FRONT_URL,
      supportedLocales: ['en', 'fr']
    },
    oidc: {
      clientUri: CONFIG.FRONT_URL,
      redirectUris: urlJoin(CONFIG.FRONT_URL, 'auth-callback'),
      postLogoutRedirectUris: urlJoin(CONFIG.FRONT_URL, 'login?logout=true'),
      tosUri: null
    },
    accessNeeds: {
      required: [
        {
          shapeTreeUri: urlJoin(CONFIG.SHAPE_REPOSITORY_URL, 'shapetrees/as/Note'),
          accessMode: ['acl:Read', 'acl:Write']
        },
        {
          shapeTreeUri: urlJoin(CONFIG.SHAPE_REPOSITORY_URL, 'shapetrees/as/Video'),
          accessMode: ['acl:Read']
        },
        {
          shapeTreeUri: urlJoin(CONFIG.SHAPE_REPOSITORY_URL, 'shapetrees/as/Article'),
          accessMode: ['acl:Read']
        },
        {
          shapeTreeUri: urlJoin(CONFIG.SHAPE_REPOSITORY_URL, 'shapetrees/as/Profile'),
          accessMode: 'acl:Read'
        },
        {
          shapeTreeUri: urlJoin(CONFIG.SHAPE_REPOSITORY_URL, 'shapetrees/File'),
          accessMode: ['acl:Read', 'acl:Write']
        },
        'apods:ReadInbox',
        'apods:ReadOutbox',
        'apods:PostOutbox',
        'apods:QuerySparqlEndpoint'
      ],
      optional: []
    },
    queueServiceUrl: CONFIG.QUEUE_SERVICE_URL
  }
};
