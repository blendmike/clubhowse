'use strict';

angular.module('myApp.directives', [])

  .directive('googleplace', ['SelectedLocation', function(SelectedLocation) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, model) {
        var options = {
          types: [],
          componentRestrictions: {}
        };
        scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

        google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
          scope.$apply(function() {
            var loc = {};

            loc.display = element.val();

            var place = scope.gPlace.getPlace();
            if (place.geometry) {
              loc.geo = {};
              loc.geo.lat = place.geometry.location.lat();
              loc.geo.lng = place.geometry.location.lng();

              SelectedLocation.setLocation(loc);
            }
          });
        });
      }
    };
  }]);