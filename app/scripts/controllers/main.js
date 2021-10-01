'use strict';

/**
 * @ngdoc function
 * @name certGeneratorWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the certGeneratorWebApp
 */
angular.module('certGeneratorWebApp')
  .controller('MainCtrl', function ($location, Auth) {
    var vm = this;
    vm.isloading = false;
    vm.login = function () {
      vm.message = "";
      vm.isloading = true;
      Auth.login(vm.account).then(function () {
        vm.isloading = false;
        $location.path('/activity');
      }, function (err) {
        vm.isloading = false;
        if (err) { vm.message = err.error_description };
        console.log(err);
        vm.message = "Cannot reach server. Please check your internet connection";
        })
        .catch(function (err) {
          vm.isloading = false;
          console.log(err);
        });
    };

    function initiatePage() {
      vm.message = '';
      vm.account = {
        username: '',
        password: ''
      };
      Auth.logout();
    }

    initiatePage();

  });
