(function () {
  'use strict';

  angular.module('App.controllers',[]); 
  angular.module('App.services',[]);
  angular.module('App',['App.controllers','App.services', 'ngRoute']);
})();