(function () {
  'use strict';

  angular.module('mean.theLab')
    .controller('StarterController', StarterController);

  StarterController.$inject = ['$scope', 'Global'];

  function StarterController ($scope, Global) {
    // Original scaffolded code.
    $scope.global = Global;
    $scope.package = {
      name: 'theLab'
    };
  }
})();
