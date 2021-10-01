'use strict';

/**
 * @ngdoc function
 * @name certGeneratorWebApp.controller:ActivityCtrl
 * @description
 * # ActivityCtrl
 * Controller of the certGeneratorWebApp
 */
angular.module('certGeneratorWebApp')
  .controller('ActivityItemCtrl', function (Api, $uibModal, $routeParams, Shared, $filter) {
    var vm = this;
    vm.error = '';

    vm.pagination = {
      pageSize: 20,
      currentPage: 1,
      total: 0
    };
      var id = $routeParams.id;

    Api.getByAction('activities', id)
      .then(function (res) {
        vm.data = res;
        vm.dates = moment(res.startDate).format('DD-MMM-YYYY');
        if (res.endDate) {
          vm.dates += ' - ' + moment(res.endDate).format('DD-MMM-YYYY');
        }
      })
      .catch(function (err) { console.log(err); });

    vm.print = function (row, index) {
      var canvas = document.getElementById('canvasX');
      var ctx = canvas.getContext('2d');
      drawCert(ctx, canvas, row);
      Api.editByAction('attendants', 'UpdatePrintCo unt', row.id)
        .then(function (res) {
          var actualIndex = (vm.pagination.pageSize * (vm.pagination.currentPage - 1)) + index;
          vm.data.attendants[actualIndex].printCount++;
        })
        .catch(function (err) { console.log(err); });
    }

    vm.filterSearchPaginate = function () {
      if (vm.data) {
        vm.attendantListSearch = $filter('filter')(vm.data.attendants, vm.searchText);
        vm.pagination.total = vm.attendantListSearch.length;
        console.log(vm.pagination.total);
        return $filter('limitTo')(vm.attendantListSearch, vm.pagination.pageSize, vm.pagination.pageSize * (vm.pagination.currentPage - 1));
      }
    };

    vm.sendMail = function (row) {
      Api.getByActionId('attendants', 'sendEmail', row.id)
        .then(function (res) {

        })
        .catch(function (err) { console.log(err); });
    }

    function drawCert(ctx, can, row) {
      var canvas = angular.element(can);
      var ig = document.getElementById('cert-print');
      var sec = document.getElementById('cert-print-sec');
      var img = angular.element(ig);
      img[0].width = 1140;
      img[0].height = 805;
      can.width = img[0].width + 40;
      can.height = img[0].height + 40;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(ig, 0, 0, can.width, can.height);
      var canCenter = can.width / 2;

      if (vm.data.certText1) {
        var certText1 = vm.data.certText1.split('\\n');
        ctx.font = "bold 16pt Calibri";
        ctx.fillStyle = "black";
        ctx.textAlign = 'center';
        var startlinePost = 440;
        certText1.forEach(function (line) {
          ctx.fillText(line, canCenter, startlinePost);
          startlinePost = startlinePost + 20;
        });
      }

      if (vm.data.certText2) {
        var certText2 = vm.data.certText2.split('\\n');
        ctx.font = "bold 16pt Calibri";
        ctx.fillStyle = "black";
        var startlinePost = 500;
        certText2.forEach(function (line) {
          ctx.fillText(line, canCenter, startlinePost);
          startlinePost = startlinePost + 20;
        });
      }
      if (vm.data.units) {
        ctx.font = "bold 16pt Calibri";
        ctx.fillStyle = "black";
        ctx.textAlign = 'left';
        var text = 'This is to certify that you attended the sessions described above and earned';
        ctx.fillText(text, 280, 680);
        text = vm.data.units + ' CLE Hour' + (vm.data.units != 1 ? 's' : '');
        ctx.fillText(text, 280, 700);
      }

      ctx.font = "28pt Berkshire Swash";
      ctx.fillStyle = "black";
      var f = Shared.toCamelCase(row.firstName || '');
      var m = Shared.toCamelCase(row.middleName || '');
      var l = Shared.toCamelCase(row.surname || '');
      var names = f + ' ' + (m ? (m + ' ') : '') + l;
      if (row.san) {
        names += ' S.A.N';
      }
      ctx.textAlign = 'center';
      ctx.fillText(names, canCenter, 570);
      if (row.branch) {
        ctx.font = "25pt Berkshire Swash";
        ctx.fillText(row.branch, canCenter, 630);
      }
      ctx.drawImage(sec, 0, 0, can.width, can.height);
      ctx.font = "12pt Berkshire Swash";
      ctx.fillStyle = "rgba(0,0,0, 0.05)";
      ctx.fillText(Shared.toCamelCase(row.surname || ''), 80, 150);
      ctx.font = "25pt Berkshire Swash";
      ctx.fillStyle = "rgba(0,0,0, 0.05)";
      ctx.fillText(Shared.toCamelCase(row.surname || ''), 100, 150);
      ctx.fillText(Shared.toCamelCase(row.surname || ''), 200, 250);
      ctx.fillText(Shared.toCamelCase(row.surname || ''), 300, 350);
      ctx.fillText(Shared.toCamelCase(row.surname || ''), 350, 950);
      printCanvas(can);
    }

    function printCanvas(can) {
      var dataUrl = can.toDataURL();

      var windowContent = '<!DOCTYPE html>';
      windowContent += '<html>';
      windowContent += '<head><title></title></head>';
      windowContent += '<body class="print-cert-portrait">';
      windowContent += '<img src="' + dataUrl + '"/>';
      windowContent += '</body>';
      windowContent += '</html>';
      var printWin = window.open('', '', 'width=940,height=760');
      printWin.document.open();
      printWin.document.write(windowContent);

      printWin.document.addEventListener('load', function () {
        printWin.focus();
        printWin.print();
        printWin.document.close();
        printWin.close();
      }, true);
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
