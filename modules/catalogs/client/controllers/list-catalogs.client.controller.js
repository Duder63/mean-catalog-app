(function () {
  'use strict';

  angular
    .module('catalogs')
    .controller('CatalogsListController', CatalogsListController);

  CatalogsListController.$inject = ['CatalogsService', '$window'];

  function CatalogsListController(CatalogsService, $window) {
    var vm = this;
    vm.user = $window.user;

    vm.catalogs = CatalogsService.query();
  }
}());
