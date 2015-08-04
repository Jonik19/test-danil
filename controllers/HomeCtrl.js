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