'use strict';

/**
 * @ngdoc overview
 * @name certGeneratorWebApp
 * @description
 * # certGeneratorWebApp
 *
 * Main module of the application.
 */
angular
  .module('certGeneratorWebApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'    
  ])
  .config(function ($routeProvider, $locationProvider, $qProvider, $httpProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

    $qProvider.errorOnUnhandledRejections(false);

    var interceptor = function (User, $q, $location) {
      return {
        request: function (config) {
          var currentUser = User.getCurrentUser();
          if (currentUser !== null) {
            config.headers['Authorization'] = 'Bearer ' + currentUser.access_token;
          }
          return config;
        },
        responseError: function (rejection) {
          if (rejection.status === 401) {
            $location.path('/');
            return $q.reject(rejection);
          }
          //TODO: handle unauthorized requests
          if (rejection.status === 403) {
            $location.path('/');
            return $q.reject(rejection);
          }

          return $q.reject(rejection);
        }
      };
    };

    var params = ['User', '$q', '$location'];
    interceptor.$inject = params;
    $httpProvider.interceptors.push(interceptor);

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/cert/:activityId/:attendantId', {
        templateUrl: 'views/cert.html',
        controller: 'CertCtrl',
        controllerAs: 'cert'
      })
      .when('/import', {
        templateUrl: 'views/import.html',
        controller: 'ImportCtrl',
        controllerAs: 'import'
      })
      .when('/attendants', {
        templateUrl: 'views/attendants.html',
        controller: 'AttendantsCtrl',
        controllerAs: 'attendants'
      })
      .when('/type', {
        templateUrl: 'views/activitytype.html',
        controller: 'ActivitytypeCtrl',
        controllerAs: 'activityType'
      })
      .when('/activity', {
        templateUrl: 'views/activity.html',
        controller: 'ActivityCtrl',
        controllerAs: 'activity'
      })
      .when('/activity/:id', {
        templateUrl: 'views/activity_item.html',
        controller: 'ActivityItemCtrl',
        controllerAs: 'activityItem'
      })
      .when('/admins', {
        templateUrl: 'views/admins.html',
        controller: 'AdminsCtrl',
        controllerAs: 'admins'
      })
      .when('/newadmin', {
        templateUrl: 'views/newadmin.html',
        controller: 'NewadminCtrl',
        controllerAs: 'newadmin'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
