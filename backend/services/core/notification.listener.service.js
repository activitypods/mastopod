const { TripleStoreAdapter } = require('@semapps/triplestore');
const { NotificationsListenerService } = require('@semapps/solid');
const CONFIG = require('../../config/config');

module.exports = {
  mixins: [NotificationsListenerService],
  adapter: new TripleStoreAdapter({ type: 'WebhookChannelListener', dataset: CONFIG.AUTH_ACCOUNTS_DATASET_NAME }),
  settings: {
    baseUrl: CONFIG.HOME_URL
  }
};
