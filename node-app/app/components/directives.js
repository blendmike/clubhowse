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

        var ADDRESS_COMPONENTS = {
          premise: { name: "street_address" },
          street_number: {},
          route: {},
          locality: { name: "city" },
          administrative_area_level_1: { short: true, name: "state" },
          postal_code: { name: "zip" }
        };
        google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
          scope.$apply(function() {
            var loc = {};

            loc.display = element.val();

            var place = scope.gPlace.getPlace();
            if (place.geometry) {
              loc.address = {};
              _.each(place.address_components, function(component) {
                var config = _.reduce(component.types, function(config, type) {
                  if (config) {
                    return config;
                  }
                  config = ADDRESS_COMPONENTS[type];
                  if (!config) {
                    return false;
                  }
                  config.name = config.name || type;
                  return config;
                }, false);
                if (config) {
                  loc.address[config.name] = config.short ? component.short_name : component.long_name;
                }
              });
              if (!loc.address.street_address) {
                if (loc.address.street_number) {
                  loc.address.street_address = loc.address.street_number + " " + loc.address.route;
                }
              }

              loc.geometry = place.geometry;
              SelectedLocation.setLocation(loc);
            }
          });
        });
      }
    };
  }]);