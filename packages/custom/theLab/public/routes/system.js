'use strict';

// Setting up route
angular.module('mean.theLab').config(['$meanStateProvider', '$urlRouterProvider',
  function ($meanStateProvider, $urlRouterProvider) {
    // For unmatched routes:
    $urlRouterProvider.otherwise('/');

    // states for my app
    $meanStateProvider
      .state('home', {
        url: '/',
        templateUrl: 'theLab/views/system/index.html'
      });
  }
]).config(['$locationProvider',
  function ($locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  }
]);
