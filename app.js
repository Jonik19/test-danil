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