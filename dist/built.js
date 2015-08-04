(function () {
  'use strict';

  angular
    .module('App')
    .config(Config)
    .run(Run);

  Config.$inject = ['$routeProvider'];
  Run.$inject = ['$rootScope', 'api'];


  function Config($routeProvider) {
      $routeProvider
        .when('/home', {
          controller: 'HomeCtrl',
          controllerAs: 'home',
          templateUrl: 'templates/HomePage.html'
        })
        .when('/:filter', {
          controller: 'HomeCtrl',
          controllerAs: 'home',
          templateUrl: 'templates/HomePage.html'
        })
        .otherwise({
          redirectTo: '/home'
        });
  };

  function Run($rootScope, api) {
    // load data from localStorage to local array
    api.load();

    $rootScope.$on('$routeChangeStart', function (event, next, prev) {
      //
    });

  };

})();
(function () {
  'use strict';

  angular
    .module('App.controllers')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['$routeParams', '$location', 'api'];


  function HomeCtrl($routeParams, $location, api) {
    var vm = this;

    var filter = {
      allows: ['power', 'rich', 'genius'],
      current: $routeParams.filter || false
    };

// If such filter not defined, redirect 
    if(!checkFilter(filter.current, filter.allows)) {
      $location.url('/home');
    }

    vm.person = {
      name: '',

      options: {
        power: filter.current === 'power',
        rich: filter.current === 'rich',
        genius: filter.current === 'genius'
      }
    };

    vm.filter = {};

    if(filter.current) {
      vm.filter.options = {};
      vm.filter.options[filter.current] = true;
    }

    // load person's array
    api.get().then(function (persons) {
      vm.persons = persons; // or just =
    });

    vm.add = function (person) {
      api.add(angular.copy(person)).then(function (person) {

        // If user set off checkox of current filter, redirect to home
        if(filter.current && !person.options[filter.current]) {
          $location.url('/home');
        }

        clearPerson();
      });
    };

    vm.delete = function (person) {
      api.delete(person).then(function (person) {
        console.log(person);
      });
    };

    vm.update = function () {
      api.save().then(function (persons) {
        console.log('updated');
      });
    };

    function checkFilter(current, allows) {
      var map = new RegExp('^('+allows.join('|')+')$');

      if(map.test(current)) {
        return true;
      }

      return false;
    }

    function clearPerson() {
      vm.person.name = '';
    }

  };

})();
(function () {
  'use strict';

  angular
    .module('App.controllers')
    .controller('SidebarCtrl', SidebarCtrl);

  SidebarCtrl.$inject = ['api', '$scope'];


  function SidebarCtrl(api, $scope) {
    var vm = this;

    api.get().then(function (persons) {
      vm.persons = persons;
    });

    $scope.$watch(function () {
      return vm.persons;
    }, function () {
      vm.total = vm.persons.length;
      vm.power = api.getFilteredBy('power').length;
      vm.rich = api.getFilteredBy('rich').length;
      vm.genius = api.getFilteredBy('genius').length;
    }, true);

  };

})();
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