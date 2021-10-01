'use strict';

/**
 * @ngdoc function
 * @name certGeneratorWebApp.controller:AttendantsCtrl
 * @description
 * # AttendantsCtrl
 * Controller of the certGeneratorWebApp
 */
angular.module('certGeneratorWebApp')
  .controller('AttendantsCtrl', function (Shared, Api, $location) {
    var vm = this;
    vm.pagination = {
      pageSize: 10,
      currentPage: 1
    };
    vm.data = Shared.getImportData();
    vm.activity = Shared.getCurrentActivity();
    if (vm.activity) {
      vm.heading = 'Attendants for ' + vm.activity.title + ' on ' + moment(vm.activity.startDate).format('DD-MMM-YYYY');
      vm.heading += vm.activity.endDate ? ' to ' + moment(vm.activity.endDate).format('DD-MMM-YYYY') : '';
    }

    if (vm.data.length) {
      vm.data.forEach(function (rec) {
        rec.selected = true;
        rec.activityId = vm.activity.id;
      });
      vm.headings = [];
      var obj = _.first(vm.data);
      for (var p in obj) {
        if (obj.hasOwnProperty(p) && (p !== 'selected' && p !== 'activityId')) {
          vm.headings.push(p);
        }
      };
    }

    vm.toggle = function (row, index) {
      var actualIndex = (vm.pagination.pageSize * (vm.pagination.currentPage - 1)) + index;
      vm.data[actualIndex].selected = !vm.data[actualIndex].selected;
    }

    vm.save = function () {
      if (vm.activity && vm.data.length) {
        vm.data.forEach(function (rec) {
          if (rec.SAN) {
            if (rec.SAN.toLowerCase() === 'yes') {
              rec.SAN = true;
            } else {
              rec.SAN = false;
            }
          } else {
            rec.SAN = false;
          }
        });
        vm.error = '';
        Api.addByAction('attendants', 'bulkAdd', vm.data)
          .then(function () {
            $location.path('/activity');
          })
          .catch(function (err) { console.log(err); vm.error = err.message ? err.message : err.data.message; });
      } else {
        vm.error = 'No activity or no attendant in this activity.';
      }
    }
  });
