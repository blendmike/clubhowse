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
    '$scope', '$location',
    function($scope,$location) {


  


      if($('.intro-text').length){
        $('.intro-text').height($(window).height() / 2.5)
      }

      setTimeout(function(){
        if($('.zen-app').length || $('.cur-mor-rates').length){
        $('.navbar-brand').addClass('app-mode')
        $('.navbar-default').addClass('app-mode')
        $(function() {
         $('aside ul li').on('click', function(){
            var id_ = $(this).attr('id');
            $('aside ul li').removeClass('current');
            $('article').removeClass('current');
            $(this).addClass('current');
            $('article.'+id_).addClass('current');

        })
    $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 500,
      values: [ 75, 300 ],
      slide: function( event, ui ) {
        $( "#amountone" ).text( "$" + ui.values[ 0 ]);
        $( "#amounttwo" ).text( "$" + ui.values[ 1 ]);
      }
    });
    $( "#amountone" ).text( "$" + $( "#slider-range" ).slider( "values", 0 ));
        $( "#amounttwo" ).text( "$" + $( "#slider-range" ).slider( "values", 1 ));
  });
      }
      },100)
      

      $scope.apply = function(){
       $location.path('/apply');
      };

      $scope.showTooltip = function($event){
        var top_ = $event.target.getBoundingClientRect().top;
        var left_ = $event.target.getBoundingClientRect().left;
        $('.tool-tip').css({
          top: top_ - $('.tool-tip').height(),
          left: left_ - ($('.tool-tip').width() / 2 - 25)

        })


                setTimeout(function(){
                   $('.tool-tip').addClass('on');
                },500)       


            


            };

      $scope.hideTooltip = function(){
        $('.tool-tip').removeClass('on');
      }

      $scope.yourRates = function(){
        $scope.$apply(function() {
            $location.path('/your-rates');
        });
      };


      

       $scope.loanFilter = function(id) {
          return appMortgage[id].relatedLoan;
       }




  
      $scope.overlay = function(a){
         if(a == "small"){
            $('.overlay').addClass('small');
            $('.overlay').toggleClass('on');

         }
         else{
            $('.overlay').removeClass('small');
             $('.overlay').toggleClass('on');
          }
      };

      $scope.runHomeSize = function(){
        $('.emblem-start .inner-container .intro-text').height($(window).height() - 310)

      };




  
        $scope.sizeControl = function (){
          $('.zen-app').height($(window).height() - 65);
        }

        $scope.runTooltip = function(){
          $('body').on('mouseenter', '.match', function(){

                $('.tool-tip').css({
                  top : $(this).offset().top - $('.tool-tip').height(),
                  left : $(this).offset().left - $('.tool-tip').width() / 2 + 20
                })

                setTimeout(function(){
                   $('.tool-tip').addClass('on');
                },500)      
          })

                    $('body').on('mouseleave', '.match', function(){
                    $('.tool-tip').removeClass('on');
          })

          $( window).scroll(function() {
              $('.tool-tip').removeClass('on');
            });
          $( ".rates-results" ).scroll(function() {
              $('.tool-tip').removeClass('on');
            });



        }



        $scope.messageId = 1;
        $scope.cardTypeId = 0;
        $scope.curPageObj = {};
        $scope.pricingMessages = pricingMessages;
        $scope.appMortgage = appMortgage;
        $scope.finalRates = finalRates;
        $scope.storeCurPriceCard = [];
        var hKey;




    $scope.getValues = function(id) {

        $scope.pM = pricingMessages[id];
        $scope.curPageObj = $scope.pM[0];
        return pricingMessages[id];

    }

    $scope.getMortgage = function(id) {

        $scope.gM = appMortgage[id];
        //$scope.curPageObj = $scope.pM[0];
        return appMortgage[id];

    }




    //console.log(storeCurPriceCard); 
    setTimeout(function() {

    for (var am = 0; am < appMortgage.length; am++) {
            var template;
            var t = template;
                t = "<div class='mortgage card mort-"+appMortgage[am].mid+"'>";
                t +=  "<p class='mort-logo'><img src='img/lender-logos/" + appMortgage[am].lender.replace(/\s+/g, '').toLowerCase() +".jpg' /></p>";
                t +=  "<p><span class='type'>" + appMortgage[am].type +"</span>";
                t +=  "<span class='apr'>" + appMortgage[am].apr +" APR</span>";
                t +=  "<span class='rate'>" + appMortgage[am].rate +"</span>";
                t +=  "<span class='mopayments'>$" + appMortgage[am].mopayments +"/mo</span></p>";
                t +=  "</div>";

                console.log(t);
                $('.best-mortgages').append(t);
           

            console.log(appMortgage[am]);

        };
        if ($('.pricing-options').length) {
            $('.pricing-options').height($('.main-view').height() / 1.65)
        }
    }, 100)

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
