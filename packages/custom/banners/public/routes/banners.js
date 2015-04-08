'use strict';

//Setting up route
angular.module('mean.banners').config(['$stateProvider',
  function($stateProvider) {
    // Check if the user is connected
    var checkLoggedin = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') $timeout(deferred.resolve);

        // Not Authenticated
        else {
          $timeout(deferred.reject);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    // states for my app
    $stateProvider
      .state('all banners', {
        url: '/banners',
        templateUrl: 'banners/views/list.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('create banner', {
        url: '/banners/create',
        templateUrl: 'banners/views/create.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('edit banner', {
        url: '/banners/:bannerId/edit',
        templateUrl: 'banners/views/edit.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('banner by id', {
        url: '/banners/:bannerId',
        templateUrl: 'banners/views/view.html',
        resolve: {
          loggedin: checkLoggedin
        }
      });
  }
]);
