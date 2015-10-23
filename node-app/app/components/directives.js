'use strict';

angular.module('myApp.directives', [])

  .directive('googleMapsInput', ['SelectedLocation', function(SelectedLocation) {
    return {
      restrict: 'A',
      transclude: true,
      link: function(scope, element, attrs, model) {
        var options = {
          types: [],
          componentRestrictions: {}
        };
        scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

        if (scope.initializeMap) {
          scope.initializeMap();
        }

        google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
          scope.$apply(function() {
            var loc = {};

            loc.display = element.val();

            var place = scope.gPlace.getPlace();
            if (place.geometry) {
              loc.geometry = place.geometry;
              SelectedLocation.setLocation(loc);
            }
          });
        });
      }
    };
  }]);