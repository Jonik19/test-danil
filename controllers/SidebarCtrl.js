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