'use strict';

/**
 * @ngdoc function
 * @name certGeneratorWebApp.controller:NewadminCtrl
 * @description
 * # NewadminCtrl
 * Controller of the certGeneratorWebApp
 */
angular.module('certGeneratorWebApp')
  .controller('NewadminCtrl', function (Api, Shared, $location) {
    var vm = this;
    Api.getByAction('account', 'getrole')
      .then(function (res) {
        vm.roles = res;
        if (res.length) {
          vm.roleId = _.last(res).name;
        }
      })
      .catch(function (err) {
        console.log(err);
      });

    vm.save = function () {
      if (Shared.isEmpty(vm.username) || Shared.isEmpty(vm.password) || Shared.isEmpty(vm.confirm)) {
        vm.error = 'Provide values to all fields';
        return;
      }
      if (vm.password !== vm.confirm) {
        vm.error = 'Password mismatch';
        return;
      }

      var user = {
        Username: vm.username,
        Password: vm.password,
        ConfirmPassword: vm.confirm,
        Role: vm.roleId
      };

      Api.add('account/register', user)
        .then(function (res) {
          $location.path('/admins');
        })
        .catch(function (err) {
          console.log(err);
          if (!_.isEmpty(err.data.modelState.err)) {
            vm.error = _.first(err.data.modelState.err);
          }
          else {
            vm.error = err.data.message;
          }
        })
    }
  });
