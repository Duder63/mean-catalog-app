(function () {
  'use strict';

  // Catalogs controller
  angular
    .module('catalogs')
    .controller('CatalogsController', CatalogsController);

  CatalogsController.$inject = ['$scope', '$timeout', '$state', '$window', 'Authentication', 'FileUploader', 'catalogResolve'];

  function CatalogsController ($scope, $timeout, $state, $location, $window, Authentication, FileUploader, catalog) {
    var vm = this;

    vm.authentication = Authentication;
    vm.catalog = catalog;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    $scope.imageURL = $scope.catalog.catalogImageURL;

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
        $state.go('catalogs.view', {
          catalogId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/catalogs/picture',
      alias: 'newCatalogPicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });    

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    }; 
    
    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };  
    
    // Change user profile picture
    $scope.uploadCatalogPicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };   

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.catalog.catalogImageURL;
    };          

  }
}());


