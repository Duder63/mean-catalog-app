'use strict';

describe('Catalogs E2E Tests:', function () {
  describe('Test Catalogs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/catalogs');
      expect(element.all(by.repeater('catalog in catalogs')).count()).toEqual(0);
    });
  });
});
