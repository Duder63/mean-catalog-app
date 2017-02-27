(function () {
  'use strict';

  // Catalogs controller
  angular
    .module('catalogs')
    .controller('CatalogsController', CatalogsController);


  CatalogsController.$inject = ['$scope', '$timeout', '$state', '$window', '$resource', 'Authentication', 'FileUploader', 'catalogResolve'];

  function CatalogsController ($scope, $timeout, $state, $window, $resource, Authentication, FileUploader, catalog) {
    var vm = this;

    // for Image Upload
    vm.catalogImageURL = '/modules/catalogs/client/img/saveme-placeholder.png';
    vm.imageURL1 = '';

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
      vm.catalog.catalogImageURL = vm.catalogImageURL;
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

    // Catalog image upload
    $scope.uploaderCatalogImage = new FileUploader({
      url: 'api/catalogs/picture'
    });

    $scope.uploaderCatalogImage.filters.push({
      name: 'imageFilter',
      fn: function(item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    $scope.uploadCatalogPicture = function() {

      $scope.sucess = vm.error = null;

      $scope.uploaderCatalogImage.uploadAll();

    };

    $scope.$watch('urlimage', function(newVal, oldVal) {

      if (newVal !== undefined) {

        $scope.catalogImageURL = newVal;

      } else {
        vm.catalogImageURL = '/modules/catalogs/client/img/saveme-placeholder.png';
      }

    });

    $scope.uploaderCatalogImage.onAfterAddingFile = function(fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);
        fileReader.onload = function(fileReaderEvent) {
          $timeout(function() {
            vm.catalogImageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    $scope.uploaderCatalogImage.onSuccessItem = function(fileItem, response, status, headers) {
      $scope.success = true;
      $scope.cancelCatalogUpload();
    };

    $scope.uploaderCatalogImage.onErrorItem = function(fileItem, response, status, headers) {
      $scope.cancelCatalogUpload();
      $scope.error = response.message;
    };

    $scope.cancelCatalogUpload = function() {
      $scope.uploaderCatalogImage.clearQueue();
      $scope.catalogImageURL = '/modules/catalogs/client/img/saveme-placeholder.png';
    };    


  }
}());


