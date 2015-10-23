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

    var METERS_PER_MILE = 1609.34;
    var URL_BASE = "https://foursquare.com/v/";
    var explore = function(loc) {
      var deferred = $q.defer();
      var awaiting = SECTIONS.length;
      var result = { photos: [], data: {}, scores: {} };
      _.each(SECTIONS, function(section) {
        exploreSection(loc, section).then(function(response) {
          result.data[section] = _.flatten(
            _.map(response.data.response.groups, function(group) {
              return _.map(group.items, function(item) {
                var obj = {
                  name: item.venue.name,
                  location: item.venue.location,
                  details: {
                    hours: item.venue.hours
                  },
                  url: URL_BASE + item.venue.id
                };
                obj.location.distance = obj.location.distance / METERS_PER_MILE;
                if (obj.location.distance >= 10) {
                  obj.location.distance = _.round(obj.location.distance);
                } else {
                  obj.location.distance = _.round(obj.location.distance, 1);
                }
                if (item.venue.featuredPhotos) {
                  obj.photos = _.compact(_.map(item.venue.featuredPhotos.items, function(item) {
                    if (item.visibility !== 'public') {
                      return false;
                    }
                    var url = item.prefix + item.width + 'x' + item.height + item.suffix;
                    result.photos.push(url);
                    return { url: url };
                  }))
                } else {
                  obj.photos = _.flatten(_.map(item.venue.photos.groups, function(group) {
                    return _.compact(_.map(group.items, function(item) {
                      if (item.visibility !== 'public') {
                        return false;
                      }
                      var url = item.prefix + item.width + 'x' + item.height + item.suffix;
                      result.photos.push(url);
                      return { url: url };
                    }));
                  }));
                }
                return obj;
              })
            }), true);
          // TODO real scores
          result.scores[section] = _.round(6.8 + .1 * awaiting, 1);]
          if (result.scores[section] === 7) {
            result.scores[section] = '7.0';
          }
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

  .service('APIRequester', ['$http', function($http) {
    return function(baseUrl, defaultParams, config) {
      config = config || {};
      return function(path, params) {
        var requestConfig = _.cloneDeep(config);
        requestConfig.params = _.defaults(params, defaultParams);
        return $http.get(baseUrl + path, requestConfig);
      }
    }
  }])

  .service('ZillowAPI', ['APIRequester', '$q', function(APIRequester, $q) {
    request = APIRequester('zillow-proxy/webservice/',
      {
        'zws-id': 'X1-ZWz1a0vjv8o5cb_4bx42'
      },
      {
        transformResponse: function(data) {
          // convert the data to JSON and provide
          // it to the success function below
          var x2js = new X2JS();
          var json = x2js.xml_str2json( data );
          return json;
        }
      }
    );

    var deepSearch = function(loc) {
      return request('GetDeepSearchResults.htm',
        {
          address: loc.address.street_address,
          citystatezip: [loc.address.city, loc.address.state, loc.address.zip].join()
        }
      ).then(function(response) {
          var searchResults = response.data.searchresults;
          if (searchResults.message.code !== "0") {
            return $q.reject();
          }
          return searchResults.response.results.result;
        });
    };

    var comps = function(home) {
      return request('GetComps.htm', { zpid: home.zpid, count: 20 }).then(function(response) {
        var searchResults = response.data.comps;
        if (searchResults.message.code !== "0") {
          return $q.reject();
        }
        var properties = searchResults.response.properties;
        properties.comparables = properties.comparables.comp;
        return properties;
      });
    };

    var search = function(loc) {
      return deepSearch(loc).then(function(home) {
        return comps(home);
      });
    };

    return {
      search: search
    };
  }])
;