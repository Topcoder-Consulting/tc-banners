'use strict';

angular.module('mean.banners').controller('BannersController', ['$scope', '$stateParams', '$location', 'Global', 'Banners',
  function($scope, $stateParams, $location, Global, Banners) {
    $scope.global = Global;

    $scope.sortType     = 'name'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.keyword   = '';     // set the default search/filter term

    $scope.bannerSizes = ['322x322', '468x60', '650x150'];

    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
      $scope.dt = null;
    };

    $scope.open = function($event, opened) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope[opened] = true;
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var banner = $scope.banner;
        banner.$save(function(response) {
          $location.path('banners/' + response._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(banner) {
      if (banner) {
        banner.$remove(function(response) {
          for (var i in $scope.banners) {
            if ($scope.banners[i] === banner) {
              $scope.banners.splice(i,1);
            }
          }
          $location.path('banners');
        });
      } else {
        $scope.banner.$remove(function(response) {
          $location.path('banners');
        });
      }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var banner = $scope.banner;
        //var tags = banner.tags[0].split(',');
        //banner.tags = tags;
        banner.$update(function() {
          $location.path('banners/' + banner._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.find = function() {
      Banners.query(function(banners) {
        $scope.banners = banners;
      });
    };

    $scope.findOne = function() {
      Banners.get({
        bannerId: $stateParams.bannerId
      }, function(banner) {
        $scope.banner = banner;
      });
    };

    $scope.new = function() {
      var banner = new Banners({
        size: '322x322',
        starts: new Date(),
        ends: '2050-01-01',
        isActive: true
      });
      $scope.banner = banner;
    };
  }
]);