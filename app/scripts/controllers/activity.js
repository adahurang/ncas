'use strict';

/**
 * @ngdoc function
 * @name certGeneratorWebApp.controller:ActivityCtrl
 * @description
 * # ActivityCtrl
 * Controller of the certGeneratorWebApp
 */
angular.module('certGeneratorWebApp')
  .controller('ActivityCtrl', function (Api, $uibModal) {
    var vm = this;
    vm.error = '';

    vm.pagination = {
      pageSize: 20,
      currentPage: 1
    };

    Api.all('activities')
      .then(function (res) {
        vm.data = _.reverse(_.sortBy(res, function (rec) { return new Date(rec.created) }));
      })
      .catch(function (err) { console.log(err); });

    vm.approve = function(id, index, row) {
        row.isloading = true;
      Api.approveActivity(id)
        .then(function (res) {
          var actualIndex = (vm.pagination.pageSize * (vm.pagination.currentPage - 1)) + index;
          vm.data[actualIndex].isApproved = true;
          row.isloading = false;
        })
        .catch(function (err) { console.log(err); });
    }

    vm.delete = function (row) {
      var modalInstance = $uibModal.open({
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'myModalContent.html',
        controller: 'ActivityModalInstanceCtrl',
        controllerAs: '$ctrl'
      });
      modalInstance.activity = row;
      modalInstance.data = vm.data;
    }
  })
  .controller('ActivityModalInstanceCtrl', function ($uibModalInstance, Api) {
    var $ctrl = this;
    $ctrl.heading = $uibModalInstance.activity.title;
    $ctrl.ok = function () {
     
      Api.deleted('Activities', $uibModalInstance.activity.id)
        .then(function () {
          var index = $uibModalInstance.data.indexOf($uibModalInstance.activity);
            if (index !== -1) {
              $uibModalInstance.data.splice(index, 1);
            }          
        })
        .catch(function (err) {
          console.log(err);
        })
      $uibModalInstance.close();
    };

    $ctrl.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  });
