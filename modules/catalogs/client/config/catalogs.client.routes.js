(function () {
  'use strict';

  angular
    .module('catalogs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('catalogs', {
        abstract: true,
        url: '/catalogs',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('catalogs.list', {
        url: '',
        templateUrl: 'modules/catalogs/client/views/list-catalogs.client.view.html',
        controller: 'CatalogsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'List of Your Catalogs'
        }
      })
      .state('catalogs.create', {
        url: '/create',
        templateUrl: 'modules/catalogs/client/views/form-catalog.client.view.html',
        controller: 'CatalogsController',
        controllerAs: 'vm',
        resolve: {
          catalogResolve: newCatalog
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Create a Catalog'
        }
      })
      .state('catalogs.edit', {
        url: '/:catalogId/edit',
        templateUrl: 'modules/catalogs/client/views/form-catalog.client.view.html',
        controller: 'CatalogsController',
        controllerAs: 'vm',
        resolve: {
          catalogResolve: getCatalog
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Catalog {{ catalogResolve.name }}'
        }
      })
      .state('catalogs.view', {
        url: '/:catalogId',
        templateUrl: 'modules/catalogs/client/views/view-catalog.client.view.html',
        controller: 'CatalogsController',
        controllerAs: 'vm',
        resolve: {
          catalogResolve: getCatalog
        },
        data: {
          pageTitle: 'Your Catalog {{ catalogResolve.name }}'
        }
      });
  }

  getCatalog.$inject = ['$stateParams', 'CatalogsService'];

  function getCatalog($stateParams, CatalogsService) {
    return CatalogsService.get({
      catalogId: $stateParams.catalogId
    }).$promise;
  }

  newCatalog.$inject = ['CatalogsService'];

  function newCatalog(CatalogsService) {
    return new CatalogsService();
  }
}());
