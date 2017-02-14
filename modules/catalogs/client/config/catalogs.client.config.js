(function () {
  'use strict';

  angular
    .module('catalogs')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Catalogs',
      state: 'catalogs',
      type: 'dropdown',
      // roles: ['*']
      roles: ['user', 'admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'catalogs', {
      title: 'List Catalogs',
      state: 'catalogs.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'catalogs', {
      title: 'Create Catalog',
      state: 'catalogs.create',
      roles: ['user']
    });
  }
}());
