'use strict';

/**
 * @ngdoc function
 * @name certGeneratorWebApp.controller:ActivityCtrl
 * @description
 * # ActivityCtrl
 * Controller of the certGeneratorWebApp
 */
angular.module('certGeneratorWebApp')
  .controller('NavbarCtrl', function ($location, Auth, User) {
    var vm = this;
    var user = User.getCurrentUser();
    vm.isAdmin = User.isAdmin();
    vm.showNav = $location.path() !== '/';
    vm.logout = function () {
      Auth.logout();
      $location.path('/');
    }
  });