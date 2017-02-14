// Catalogs service used to communicate Catalogs REST endpoints
(function () {
  'use strict';

  angular
    .module('catalogs')
    .factory('CatalogsService', CatalogsService);

  CatalogsService.$inject = ['$resource'];

  function CatalogsService($resource) {
    return $resource('api/catalogs/:catalogId', {
      catalogId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
