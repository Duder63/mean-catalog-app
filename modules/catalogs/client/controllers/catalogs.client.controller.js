(function () {
  'use strict';

  // Catalogs controller
  angular
    .module('catalogs')
    .controller('CatalogsController', CatalogsController);


  CatalogsController.$inject = ['$scope', '$http', '$timeout', '$state', '$location', '$window', 'Authentication', 'FileUploader', 'catalogResolve'];

  function CatalogsController ($scope, $http, $timeout, $state, $location, $window, Authentication, FileUploader, catalog) {
    var vm = this;

    vm.authentication = Authentication;
    vm.catalog = catalog;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;


    // Remove existing Catalog
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.catalog.$remove($state.go('catalogs.list'));
      }
    }

    // Save Catalog
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.catalogForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.catalog._id) {
        vm.catalog.$update(successCallback, errorCallback);
      } else {
        vm.catalog.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('catalogs.list', {
          catalogId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }


  }
}());


