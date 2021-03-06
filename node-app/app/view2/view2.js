'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope', 'SelectedLocation', 'FoursquareAPI', 'ZillowAPI', '$location', function($scope, SelectedLocation, FoursquareAPI, ZillowAPI, $location) {


  $('.portfolio-grid article a, .button, button, input[type="submit"], input[type="reset"], input[type="button"], #header a, .header-button, #nav-container a, .nav-child-container, .gallery-container a, #ps-custom-back').on('hover', function(event) {
    $(this).toggleClass('hover');
  });

  /* Sidebar multi-level menu */

  $('.nav-child-container').on('click', function(event) {
    event.preventDefault();
    var $this = $(this);
    var ul = $this.next('ul');
    var ulChildrenHeight = ul.children().length * 46;

    if(!$this.hasClass('active')){
      $this.toggleClass('active');
      ul.toggleClass('active');
      ul.height(ulChildrenHeight + 'px');
    }else{
      $this.toggleClass('active');
      ul.toggleClass('active');
      ul.height(0);
    }
  });

  /* Sidebar Functionality */

  var opened = false;
  $('#menu-trigger-close').on('click', function(){
    $('#menu-trigger').trigger('click');
  })
  $('#menu-trigger').on('click', function(event) {
    $('#content-container').toggleClass('active');
    $('#sidemenu').toggleClass('active');
    if(opened){
      opened = false;
      setTimeout(function() {
        $('#sidemenu-container').removeClass('active');
      }, 500);
    } else {
      $('#sidemenu-container').addClass('active');
      opened = true;
    }
  });

  $('.nav a').bind('click', function(event) {
    event.preventDefault();
    var path = $(this).attr('href');
    $('#content-container').toggleClass('active');
    $('#sidemenu').toggleClass('active');
    setTimeout(function() {
      window.location = path;
    }, 500);
  });

  /* Swipe menu support */

  // $('.touch-gesture #content').hammer().on('swiperight', function(event) {
  //   $('#content-container').addClass('active');
  //   $('#sidemenu').addClass('active');
  //   if(opened){
  //     opened = false;
  //     setTimeout(function() {
  //       $('#sidemenu-container').removeClass('active');
  //     }, 500);
  //   } else {
  //     $('#sidemenu-container').addClass('active');
  //     opened = true;
  //   }
  // });

  // $('.touch-gesture #content').hammer().on('swipeleft', function(event) {
  //   $('#content-container').removeClass('active');
  //   $('#sidemenu').removeClass('active');
  //   if(opened){
  //     opened = false;
  //     setTimeout(function() {
  //       $('#sidemenu-container').removeClass('active');
  //     }, 500);
  //   } else {
  //     $('#sidemenu-container').addClass('active');
  //     opened = true;
  //   }
  // });


    var maps = []
    $scope.initializeMap = function() {

  // Create an array of styles.
  var styles = [{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#d3d3d3"}]},{"featureType":"transit","stylers":[{"color":"#808080"},{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#b3b3b3"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"weight":1.8}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#d7d7d7"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ebebeb"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#a7a7a7"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#efefef"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#696969"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#737373"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#d6d6d6"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#dadada"}]}];

  // Create a new StyledMapType object, passing it the array of styles,
  // as well as the name to be displayed on the map type control.
  var styledMap = new google.maps.StyledMapType(styles,
    {name: "Styled Map"});


  var styles_two = [{"featureType":"landscape.man_made","elementType":"geometry","stylers":[{"color":"#f7f1df"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#d0e3b4"}]},{"featureType":"landscape.natural.terrain","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","elementType":"geometry","stylers":[{"color":"#fbd3da"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#bde6ab"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffe15f"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#efd151"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"color":"black"}]},{"featureType":"transit.station.airport","elementType":"geometry.fill","stylers":[{"color":"#cfb2db"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#a2daf2"}]}];

   var styledMapTwo = new google.maps.StyledMapType(styles_two,
    {name: "Styled Map Two"});


  // Create a map object, and include the MapTypeId to add
  // to the map type control.
  var loc = SelectedLocation.loc();
  var mapOptions = {
    zoom: 11,
    center: new google.maps.LatLng(loc.geometry.location.lat(), loc.geometry.location.lng()),
    disableDefaultUI: true,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }
  };
  var map = new google.maps.Map(document.getElementById('map'),mapOptions);
  var mapTwo = new google.maps.Map(document.getElementById('map-two'), mapOptions);
  maps.push(map, mapTwo);


  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');

  mapTwo.mapTypes.set('map_style', styledMapTwo);
  mapTwo.setMapTypeId('map_style');
};



  var $navItems = $('.nav ul li a');

  $navItems.each(function(index){
    if ($(this).hasClass('current')) {
      $parentUl = $(this).parent().parent();
      $parentUl.height($parentUl.children('li').length * 46 + "px");
      $parentUl.prev().addClass('active');
      $parentUl.addClass('active');
      $anchor = $parentUl.prev();
      $anchor.children('.nav-child-container').addClass('active');
    }
  });




  var $alertBoxes = $('.alert-box .close');

  $alertBoxes.on('click', function(event) {
    event.preventDefault();
    var $parent = $(this).parent('.alert-box');
    $parent.fadeOut(500);
    setTimeout(function() { $parent.hide(0); }, 500);
  });


    function shuffleIn(to, from) {
      to = to || [];
      for (var fromIndex = 0; fromIndex < from.length; fromIndex++) {
        if (!_.contains(to, from[fromIndex])) {
          var toIndex = Math.floor(Math.random() * to.length);
          to.splice(toIndex, 0, from[fromIndex]);
        }
      }
      return to;
    }

    $scope.data = {};
    var doWithLoc = function(loc) {




      console.log(loc);
      $scope.loc = loc;
      $scope.data = { scores: {} };
      if ($scope.loc.address) {
        $.ajax({
          url: "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles="+$scope.loc.address.city,
          dataType: "jsonp",
          success: function( response ) {
            var obj_ = response.query.pages;
            var value_ = obj_[Object.keys(obj_)[0]];
            $scope.wiki = value_.extract;
          }
        });
      }
      if ($scope.loc.address) {
        ZillowAPI.search(loc).then(function(response) {
          $scope.data.zillow = response;
        }, function() {
          console.log('zillow error! :-/');
        })
      }
      if ($scope.loc.geometry) {
        locProps.forEach(function (k) {
          $location.search(k, loc[k]);
        });
        addressProps.forEach(function (k) {
          $location.search(k, loc.address[k]);
        });
        geoProps.forEach(function (k) {
          $location.search(k, loc.geometry.location[k]());
        });

        //console.log($scope.loc.geometry.location.lat());
        //console.log($scope.loc.geometry.location.lng());
        FoursquareAPI.explore(loc).then(function(response) {
          $scope.data.foursquare = response.data;
          $scope.data.photos = shuffleIn($scope.data.photos, response.photos);
          _.assign($scope.data.scores, response.scores);
          console.log($scope.data);
        }, function() {
          $scope.data.foursquare = {};
        });
      }
      _.each(maps, function (map) {
        if (loc.geometry.viewport) {
          map.fitBounds(loc.geometry.viewport);
        } else {
          map.setCenter(loc.geometry.location);
          map.setZoom(17);  // Why 17? Because it looks good.
        }
      });
    };
    SelectedLocation.setDoWithLocation(doWithLoc);
    var defaultValues = {
      display: '130 Vale Ave, San Francisco, CA, United States',
      city: "San Francisco",
      route: "Vale Avenue",
      state: "CA",
      street_address: "130 Vale Avenue",
      street_number: "130",
      zip: "94132",
      lat: '37.734905',
      lng: '-122.48385400000001'
    };
    var locProps = ['display'];
    var addressProps = ['city', 'route', 'state', 'street_address', 'street_number', 'zip'];
    var geoProps = ['lat', 'lng'];
    var loc = {};
    var savedState = $location.search();
    _.each(locProps, function (prop) {
      if (typeof savedState[prop] !== 'undefined') {
        loc[prop] = savedState[prop];
      } else {
        loc[prop] = defaultValues[prop];
      }
    });
    loc.address ={}
    _.each(addressProps, function (prop) {
      if (typeof savedState[prop] !== 'undefined') {
        loc.address[prop] = savedState[prop];
      } else {
        loc.address[prop] = defaultValues[prop];
      }
    });
    loc.geometry = { location: {} };
    _.each(geoProps, function(prop) {
      if (typeof savedState[prop] !== 'undefined') {
        loc.geometry.location[prop] = function() { return savedState[prop] };
      } else {
        loc.geometry.location[prop] = function() { return defaultValues[prop] };
      }
    });
    SelectedLocation.setLocation(loc);
}]);
