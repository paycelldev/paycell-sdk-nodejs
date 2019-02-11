var { init } = require('../services/InitService')
var { queryStatu } = require('../services/QueryStatuService')
var { reverse } = require('../services/ReverseService')
var { refund } = require('../services/RefundService')

/**
 * Routes for backend
 */
module.exports = function (app) {
  app.route('/api/init')
    .post(init);
  app.route('/api/queryStatu')
    .post(queryStatu);
  app.route('/api/reverse')
    .post(reverse);
  app.route('/api/refund')
    .post(refund);
}