'use strict';

angular.module('myApp.data-test', ['ngRoute', 'myApp.directives'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/data-test', {
      templateUrl: 'data-test/data-test.html',
      controller: 'DataTestCtrl'
    });
  }])

  .controller('DataTestCtrl', ['$scope', 'SelectedLocation', "FoursquareAPI", function($scope, SelectedLocation, FoursquareAPI) {
    $scope.gPlace = "";
    $scope.data = "nothing.";

    $scope.loc = {};

    SelectedLocation.setDoWithLocation(function(loc) {
      $scope.loc = loc;
      if ($scope.loc.geo) {
        FoursquareAPI.explore(loc).then(function(response) {
          $scope.data = "success";
        }, function() {
          $scope.data = "failure";
        });
      }
    })
  }]);