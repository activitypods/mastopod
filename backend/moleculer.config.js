const { WebAclMiddleware, CacherMiddleware } = require('@semapps/webacl');
const CONFIG = require('./config/config');

Error.stackTraceLimit = Infinity;

// Use the cacher only if Redis is configured
const cacherConfig = CONFIG.REDIS_CACHE_URL
  ? {
      type: 'Redis',
      options: {
        prefix: 'action',
        ttl: 2592000, // Keep in cache for one month
        redis: CONFIG.REDIS_CACHE_URL
      }
    }
  : undefined;

// Temporary solution for https://github.com/assemblee-virtuelle/semapps/issues/1424
const SkipOrphanBlankNodesCleanupMiddleware = () => ({
  name: 'SkipOrphanBlankNodesCleanupMiddleware',
  localAction: (next, action) => {
    if (action.name === 'triplestore.deleteOrphanBlankNodes') {
      return async ctx => {};
    } else {
      return next;
    }
  }
});

module.exports = {
  // You can set all ServiceBroker configurations here
  // See https://moleculer.services/docs/0.14/configuration.html
  middlewares: [
    SkipOrphanBlankNodesCleanupMiddleware(),
    CacherMiddleware(cacherConfig), // Set the cacher before the WebAcl middleware
    WebAclMiddleware({ baseUrl: CONFIG.HOME_URL })
  ],
  logger: {
    type: 'Console',
    options: {
      formatter: 'short',
      level: 'info'
    }
  }
};
