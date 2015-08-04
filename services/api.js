(function () {
  'use strict';

  angular
    .module('App.services')
    .factory('api', api);

  api.$inject = ['$http', '$q'];


  function api($http, $q) {
    var factory = {};

    var STORAGE_ID = 'persons';

    factory.persons = [];

    factory.load = function () {
      var deffered = $q.defer();

      angular.copy(getFromStrorage(), factory.persons);

      deffered.resolve(factory.persons);

      return deffered.promise;
    };

    factory.get = function (options) {
      var deffered = $q.defer();
      var filtered;

      if(options && options.filteredBy) {
        filtered = factory.getFilteredBy(options.filteredBy);
      }

      deffered.resolve(filtered || factory.persons);

      return deffered.promise;
    };

    factory.add = function (person) {
      var deffered = $q.defer();

      factory.persons.push(person);
      
      saveToStorage(factory.persons);
      
      deffered.resolve(person);

      return deffered.promise;
    };

    factory.delete = function (person) {
      var deffered = $q.defer();

      factory.persons.splice(factory.persons.indexOf(person), 1);
      saveToStorage(factory.persons);

      deffered.resolve(factory.persons);

      return deffered.promise;
    };

    factory.save = function () {
      var deffered = $q.defer();

      saveToStorage(factory.persons);

      deffered.resolve(factory.persons);

      return deffered.promise;
    };

    factory.getFilteredBy = function (filteredBy) {
      return factory.persons.filter(function (item, i, arr) {
        return item.options[filteredBy];
      });
    }

    return factory;

    function getFromStrorage() {
      return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
    }

    function saveToStorage(persons) {
      localStorage.setItem(STORAGE_ID, JSON.stringify(persons));
    }

  };

})();