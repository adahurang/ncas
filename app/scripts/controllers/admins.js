'use strict';

/**
 * @ngdoc function
 * @name certGeneratorWebApp.controller:AdminsCtrl
 * @description
 * # AdminsCtrl
 * Controller of the certGeneratorWebApp
 */
angular.module('certGeneratorWebApp')
  .controller('AdminsCtrl', function (Api) {
    var vm = this;
    vm.pagination = {
      pageSize: 10,
      currentPage: 1
    };

    Api.getByAction('account', 'getuser')
      .then(function (res) {
        vm.data = res;
      })
      .catch(function (err) {
        console.log(err);
      });
    vm.getRole = function (roles) {
      var roleObj = _.first(roles);
      return roleObj ? roleObj.name : '**Unknown';
    }

    vm.delete = function (row) {
      Api.deleted('account', row.id)
        .then(function () {
          Api.getByAction('account', 'getuser')
            .then(function (res) {
              vm.data = res;
            })
            .catch(function (err) {
              console.log(err);
            });
        })
        .catch(function (err) {
          console.log(err);
        });
    }
    
  });
