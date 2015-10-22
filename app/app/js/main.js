//main angular file
(function () {

'use strict';


  var app = angular.module('Clubhowse', ['ngRoute', 'ngAnimate']);

  app.config([
    '$locationProvider',
    '$routeProvider',
    function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');
      // routes
      $routeProvider
        .when("/", {
          templateUrl: "./partials/home.html",
          controller: "MainController"
        })
        .when("/apply", {
          templateUrl: "./partials/dashboard.html",
          controller: "MainController"
        })
        .when("/your-rates", {
          templateUrl: "./partials/partial4.html",
          controller: "MainController"
        })
        .otherwise({
           redirectTo: '/'
        });
    }
  ]);

  app.filter('removeSpacesThenLowercase', function () {
        return function (text) {
        var str = text.replace(/\s+/g, '');
          str = str.replace(/[^\w\s]/gi, '');
          return str.toLowerCase();
        };
  })



  app.controller('MainController', [
    '$scope', '$location', '$rootScope',
    function($scope,$location, $rootScope, addressCapture) {



        $rootScope.addressCapture = addressCapture


        $rootScope.$watch('addressCapture', function(){
          alert(addressCapture);
        }, true);  

        


      

   










    //var PricingProcess = Parse.Object.extend("PricingProcess");
    //var pricingProcess = new PricingProcess();

    $scope.updateMessageId = function(passMessageId, captureValue) {

        var arr_ = pricingMessages[passMessageId];
            if(typeof arr_ !== "undefined" ){
            arr_ = arr_.slice(-1)[0].step;
            arr_ = arr_.replace(/\s+/g, '');
            arr_ = arr_.replace(/[^\w\s]/gi, '');
            arr_ = arr_.toLowerCase();
            
            console.log(arr_);

            $('.left-nav ul li').removeClass('current');
            $('.left-nav ul li.'+arr_).addClass('current');

            }


        if(passMessageId == '0'){

          $scope.runLenderSearch();
        }
        else{
          $scope.messageId = passMessageId;
        }
               if(passMessageId == '3'){

          $('.reco-cont').addClass('on');
        }
        $('.mort-'+passMessageId).fadeOut(599);
//        pricingProcess.save(captureValue).then(function(object) {
            // /console.log(pricingProcess);
        //});

    };

    $scope.runLenderSearch = function(){
      $('.reco-cont').remove();
      var cont = $('.col-md-6');
      cont.empty();
      var t;
      t = '<div class="lender-search">';
      t += '<h2>Finding the best loans for you...</h2>';
      t += '<div class="loading-bar"></div>';
      // t += '<ul class="logos">';
      // t += '<li><img src="" /></li>';
      // t += '<li><img src="" /></li>';
      // t += '<li><img src="" /></li>';
      // t += '<li><img src="" /></li>';
      // t += '<li><img src="" /></li>';
      // t += '</ul>';
      t += '</div>';
      cont.append(t);

      setTimeout(function(){

        $('.loading-bar').addClass('active')},400);

      setTimeout(function(){
        $scope.yourRates();
      }, 4000)
    }

    $scope.runLenderApproval = function() {
      var cont = $('.col-md-6');

      cont.empty();
      var t;
      t = '<div class="lender-search">';
      // t += '<img src="../img/lender-logos/citi.jpg" />';
      t += '<h2>You\'re approved for 470 loans!</h2>';
      t += '<p>Find the one you want, then we\'ll connect you with the lender to clse the loan</p>';
      t += '<button id="view-rates">View My Loans</button>';
      t += '</div>';
      cont.append(t);

      $('.col-md-6').on('click', '#view-rates', function(){
        $scope.yourRates();
      })

    }

    $scope.choosePricingOption = function(a, b) {

        var r = storeCurPriceCard;
        hKey = this.card.$$hashKey;

        for (var i = 0; i < storeCurPriceCard.length; i++) {
            // console.log(hKey + ' ' + storeCurPriceCard[i].$$hashKey);
            if (hKey == storeCurPriceCard[i].$$hashKey) {
                console.log('testing')
                runSplice(hKey, i);
                break;
            } else {
                storeCurPriceCard.push(this.card);
                console.log(storeCurPriceCard);
            };
        };


        function runSplice(hKey, i) {
            storeCurPriceCard.splice(i, 1);
            console.log(storeCurPriceCard);

        }

        if (r.length == 0) {
            storeCurPriceCard.push(this.card);
        }

    }

    $scope.cardContent = function(id, tvalue, e) {
        $scope.cardTypeId = id;
        $('.dropdown-text').text(tvalue);
        $('ul li.active').removeClass('active');
        var elem = angular.element(e.target);
        elem.addClass('active');
    }


    $scope.changePricingOptions = function() {
        $('.sub-nav').toggleClass('visible');
        $('.pricing-options').toggleClass('visible');

    }

    $scope.cardType = function(id) {
        $scope.storeCurPriceCard = id;

        return $scope.curPageObj.cards[id];
    }

    $scope.values = undefined;

    runSize();
    $('body').addClass('loaded');
    $('body').on('click', '#dcontainer', function() {
    })

    function runSize() {
        if ($(window).width() < 1020) {
            $('body').addClass('tablet');

            if ($(window).width() < 770) {
                $('body').addClass('mobile');
            }
        } else {
            $('body').removeClass('mobile');
            $('body').removeClass('tablet');
        }
        $('.col-md-3.large, .main-view').height($(window).height() - 50);
        $('.message-container').height($(window).height() - 200)

        setTimeout(function() {
            if ($('.pricing-options').length) {
                $('.pricing-options').height($('.main-view').height() / 1.2)
            }
        }, 100)
    }

    var delay = (function() {
        var timer = 0;
        return function(callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    $(window).resize(function() {
        delay(function() {
            runSize();
            //...
        }, 100);
    });
    // Triggers
    $('.tooltip-social').tooltip({
        selector: "a[data-toggle=tooltip]"
    })




    $('.slide-content').addClass('active');

    $('body').on('click', '.card .row button', function() {

        $('.buttons .slide-content button').trigger('click');


    })





    }

  ]);

    app.directive('runPresentation', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    setTimeout(function() {
                      $('.message-content:first-child').addClass('active');
                        runProcess()
                    }, 1000);
                })
            }
     
        }
    }
  });


}());
