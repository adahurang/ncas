'use strict';

/**
 * @ngdoc function
 * @name certGeneratorWebApp.controller:ActivitytypeCtrl
 * @description
 * # ActivitytypeCtrl
 * Controller of the certGeneratorWebApp
 */
angular.module('certGeneratorWebApp')
  .controller('ActivitytypeCtrl', function (Api) {
    var vm = this;

    vm.error = '';
    var entity = 'ActivityTypes';
    reloadList();

    vm.add = function () {
      if (vm.name) {
        vm.error = '';
        var payload = {
          Name: vm.name
        };
        Api.add(entity, payload)
          .then(function (res) {
            clearForm();
            reloadList();
          })
          .catch(function (err) { console.log(err); vm.error = err.message; });
      } else {
        vm.error = 'Enter the name of the new activity type';
      }
    }

    vm.delete = function (id) {
      Api.deleted(entity, id)
        .then(function (res) {
          reloadList();
        })
        .catch(function (err) { console.log(err); vm.error = err.message; });
    }

    function reloadList() {
      Api.all(entity)
        .then(function (res) {
          vm.data = res;
        })
        .catch(function (err) { console.log(err); vm.error = err.message; });
    }

    function clearForm() {
      vm.name = '';
    }
  });
