'use strict';

angular.module('myApp.view1', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
      templateUrl: 'view1/view1.html',
      controller: 'View1Ctrl'
    });
  }])

  .controller('View1Ctrl', ['SelectedLocation', '$location', function(SelectedLocation, $location) {
    var locProps = ['display'];
    var addressProps = ['city', 'route', 'state', 'street_address', 'street_number', 'zip'];
    var geoProps = ['lat', 'lng'];
    SelectedLocation.setDoWithLocation(function(loc) {
      $location.path('/view2')
      locProps.forEach(function (k) {
        $location.search(k, loc[k]);
      });
      addressProps.forEach(function (k) {
        $location.search(k, loc.address[k]);
      });
      geoProps.forEach(function (k) {
        $location.search(k, loc.geometry.location[k]());
      });
    })
  }]);
