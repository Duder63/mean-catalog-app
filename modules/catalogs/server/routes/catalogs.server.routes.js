'use strict';

/**
 * Module dependencies
 */
var catalogsPolicy = require('../policies/catalogs.server.policy'),
  catalogs = require('../controllers/catalogs.server.controller');

module.exports = function(app) {
  // Catalogs Routes
  app.route('/api/catalogs').all(catalogsPolicy.isAllowed)
    .get(catalogs.list)
    .post(catalogs.create);

  app.route('/api/catalogs/:catalogId').all(catalogsPolicy.isAllowed)
    .get(catalogs.read)
    .put(catalogs.update)
    .delete(catalogs.delete);

  // Finish by binding the Catalog middleware
  app.param('catalogId', catalogs.catalogByID);
};
