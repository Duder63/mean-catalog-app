(function () {
  'use strict';

  angular
    .module('catalogs')
    .controller('CatalogsListController', CatalogsListController);

  CatalogsListController.$inject = ['CatalogsService'];

  function CatalogsListController(CatalogsService) {
    var vm = this;

    vm.catalogs = CatalogsService.query();
  }
}());
