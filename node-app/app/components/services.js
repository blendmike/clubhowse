'use strict';

angular.module('myApp.services', [])

  .service('SelectedLocation', [function() {
    var loc;
    var todoWithLocation = false;

    var setLocation = function(newLoc) {
      loc = newLoc;
      if (todoWithLocation) {
        todoWithLocation(newLoc);
      }
    };

    var setDoWithLocation = function(newTodoWithLocation) {
      todoWithLocation = newTodoWithLocation;
    };

    var getLoc = function() {
      return loc;
    };

    return {
      setLocation: setLocation,
      setDoWithLocation: setDoWithLocation,
      loc: getLoc
    }
  }])

  .service('FoursquareAPI', ['$http', '$q', function($http, $q) {
    var DEFAULT_PARAMS = {
      client_id: 'U3UUXHJ4BVN5UK35VGYVKC1UX42S0IZZNDVWZHMTJPIPIRZM',
      client_secret: '5TPPOCNMYSKA1QK3TQNK5S01UTC0QT0SJU2C10HWZ1NRBITW',
      v: '20140806',
      m: 'foursquare'
    };

    var BASE_URL = 'https://api.foursquare.com/v2/';

    var request = function(path, params) {
      return $http.get(BASE_URL + path, { params: _.defaults(params, DEFAULT_PARAMS) });
    };


    var SECTIONS = [
      "food",
      "drinks",
      "coffee",
      "shops",
      "arts",
      "outdoors",
      "sights"
    ];

    var exploreSection = function(loc, section) {
      return request("venues/explore", {
        ll: loc.geometry.location.lat() + ", " + loc.geometry.location.lng(),
        section: section,
        limit: 50,
        venuePhotos: 1
      })
    };

    var explore = function(loc) {
      var deferred = $q.defer();
      var awaiting = SECTIONS.length;
      var result = {};
      _.each(SECTIONS, function(section) {
        exploreSection(loc, section).then(function(response) {
          result.photos = [];
          result.data = {};
          result.data[section] = _.flatten(
            _.map(response.data.response.groups, function(group) {
              return _.map(group.items, function(item) {
                return {
                  name: item.venue.name,
                  location: item.venue.location,
                  details: {
                    hours: item.venue.hours
                  },
                  photos: _.flatten(_.map(item.venue.photos.groups, function(group) {
                    return _.compact(_.map(group.items, function(item) {
                      if (item.visibility !== 'public') {
                        return false;
                      }
                      var url = item.prefix + item.width + 'x' + item.height + item.suffix;
                      result.photos.push(url);
                      return { url: url };
                    }));
                  }))
                }
              })
            }), true);
          awaiting = awaiting - 1;
          if (!awaiting) {
            deferred.resolve(result);
          }
        }, function() {
          console.log("Foursquare: " + section + " failed.");
          deferred.reject()
        })
      });

      return deferred.promise;
    };

    return {
      explore: explore
    }
  }])
;