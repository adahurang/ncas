'use strict';

/**
 * @ngdoc service
 * @name certGeneratorWebApp.User
 * @description
 * # User
 * Service in the certGeneratorWebApp.
 */
angular.module('certGeneratorWebApp')
  .service('User', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var currentUser = null;
    function setCurrentUser(user) {
      currentUser = user;
      sessionStorage.user = angular.toJson(user);
    }
    function getCurrentUser() {
      currentUser = angular.fromJson(sessionStorage.user);
      if (angular.isUndefined(currentUser)) {
        currentUser = null;
      }
      return currentUser;
    }

    function isAdmin() {
      var result = false;
      var user = angular.fromJson(sessionStorage.user);
      if (!angular.isUndefined(user)) {
        if (user.hasOwnProperty('roles')) {
          var roles = JSON.parse(user.roles);
          roles.forEach(function (role) {
            if (role === 'Admin') {
              result = true;
              return;
            }
          });
        }
      }
      return result;
    }



    return {
      setCurrentUser: setCurrentUser,
      getCurrentUser: getCurrentUser,
      currentUser: currentUser,
      isAdmin: isAdmin
    };
  });
