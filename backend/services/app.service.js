const urlJoin = require('url-join');
const { AppService } = require('@activitypods/app');
const CONFIG = require('../config/config');

// For documentation, see: https://docs.activitypods.org/app-framework/backend/application-registration/
module.exports = {
  mixins: [AppService],
  settings: {
    app: {
      name: CONFIG.APP_NAME,
      description: CONFIG.APP_DESCRIPTION,
      thumbnail: urlJoin(CONFIG.FRONT_URL, 'logo192.png'),
      frontUrl: CONFIG.FRONT_URL
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
          registeredClass: 'as:Note',
          accessMode: ['acl:Read', 'acl:Write']
        },
        {
          registeredClass: 'vcard:Individual',
          accessMode: 'acl:Read'
        },
        'apods:ReadInbox',
        'apods:ReadOutbox',
        'apods:PostOutbox',
        'apods:QuerySparqlEndpoint',
        'apods:CreateWacGroup',
        'apods:CreateCollection',
        'apods:UpdateWebId'
      ],
      optional: []
    },
    classDescriptions: {
      'as:Note': {
        label: {
          en: 'Messages',
          fr: 'Messages'
        },
        openEndpoint: urlJoin(CONFIG.FRONT_URL, '/r')
      }
    },
    queueServiceUrl: CONFIG.QUEUE_SERVICE_URL
  }
};
