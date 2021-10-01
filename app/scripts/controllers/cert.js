'use strict';

/**
 * @ngdoc function
 * @name certGeneratorWebApp.controller:ActivityCtrl
 * @description
 * # ActivityCtrl
 * Controller of the certGeneratorWebApp
 */
angular.module('certGeneratorWebApp')
  .controller('CertCtrl', function ($uibModal, $routeParams, Api, Shared) {
    var vm = this;
    var activityid = $routeParams.activityId;
    var attendantid = $routeParams.attendantId;
    var img = document.getElementById('cert');
    vm.error = false;
    vm.errorMessage = '';

    Api.getByActionId('attendants', 'getattendant', attendantid)
      .then(function (res) {
        vm.attendant = res;
          vm.dates = moment(res.activity.startDate).format('DD-MMM-YYYY');
          if (res.endDate) {
            vm.dates += ' - ' + moment(res.activity.endDate).format('DD-MMM-YYYY');
          }
      })
      .catch(function (err) {
        console.log(err);
        vm.error = true;
        vm.errorMessage = 'No record found. Please use the link sent to your email';
        if (err.status === 400) {
          if (err.data.message === 'expired') {
            vm.errorMessage = 'Sorry!!! the print period for this certificate has elapsed';
          }
        }
      });


    vm.print = function () {
      var canvas = document.getElementById('canvasX2');
      var ctx = canvas.getContext('2d');
      var ig = new Image();
      drawCert(ctx, canvas);
      printCanvas();
      Api.editByAction('attendants', 'UpdatePrintCount', vm.attendant.id)
          .then(function(res) {
          })
          .catch(function(err) { console.log(err); });
    }

    function printCanvas() {
      var dataUrl = document.getElementById('canvasX2').toDataURL();
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

    vm.preview = function (size) {
      var parent = angular.element(document.getElementById('modal-parent'));
      var modalInstance = $uibModal.open({
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        controllerAs: '$ctrl',
        size: size,
        appendTo: parent
      });

      modalInstance.rendered.then(function () {
        var canvas = document.getElementById('canvasX');
        var ctx = canvas.getContext('2d');
        var ig = new Image();
        drawCert(ctx, canvas);
      });

      modalInstance.result.then(function (result) {
      }, function () {
      });
    }

    function drawCert(ctx, can) {
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
      ctx.textAlign = 'center';

      if (vm.attendant.activity.certText1) {
        var certText1 = vm.attendant.activity.certText1.split('\\n');
        ctx.font = "bold 16pt Calibri";
        ctx.fillStyle = "black";
        var startlinePost = 440;
        certText1.forEach(function (line) {
          ctx.fillText(line, canCenter, startlinePost);
          startlinePost = startlinePost + 20;
        });
      }

      if (vm.attendant.activity.certText2) {
        var certText2 = vm.attendant.activity.certText2.split('\\n');
        ctx.font = "bold 16pt Calibri";
        ctx.fillStyle = "black";
        var startlinePost = 500;
        certText2.forEach(function (line) {
          ctx.fillText(line, canCenter, startlinePost);
          startlinePost = startlinePost + 20;
        });
      }

      ctx.textAlign = 'left';
      if (vm.attendant.activity.units) {
        ctx.font = "bold 16pt Calibri";
        ctx.fillStyle = "black";
        ctx.textAlign = 'left';
        var text = 'This is to certify that you attended the sessions described above and earned';
        ctx.fillText(text, 280, 680);
        text = vm.attendant.activity.units + ' CLE Hour' + (vm.attendant.activity.units != 1 ? 's' : '');
        ctx.fillText(text, 280, 700);
      }

      ctx.textAlign = 'center';
      ctx.font = "30pt Berkshire Swash";
      ctx.fillStyle = "black";
      var f = Shared.toCamelCase(vm.attendant.firstName || '');
      var m = Shared.toCamelCase(vm.attendant.middleName || '');
      var l = Shared.toCamelCase(vm.attendant.surname || '');
      var names = f + ' ' + (m ? (m + ' ') : '') + l;
      if (vm.attendant.san) {
        names += ' S.A.N';
      }
      ctx.fillText(names, canCenter, 570);
      if (vm.attendant.branch) {
        ctx.font = "25pt Berkshire Swash";
        ctx.fillText(vm.attendant.branch, canCenter, 630);
      }
      ctx.drawImage(sec, 0, 0, can.width, can.height);
      ctx.textAlign = 'left';
      ctx.font = "12pt Berkshire Swash";
      ctx.fillStyle = "rgba(0,0,0, 0.05)";
      ctx.fillText(Shared.toCamelCase(vm.attendant.surname || ''), 80, 150);
      ctx.font = "25pt Berkshire Swash";
      ctx.fillStyle = "rgba(0,0,0, 0.05)";
      ctx.fillText(Shared.toCamelCase(vm.attendant.surname || ''), 100, 150);
      ctx.fillText(Shared.toCamelCase(vm.attendant.surname || ''), 200, 250);
      ctx.fillText(Shared.toCamelCase(vm.attendant.surname || ''), 300, 350);
      ctx.fillText(Shared.toCamelCase(vm.attendant.surname || ''), 350, 950);
    }

  })
.controller('ModalInstanceCtrl', function ($uibModalInstance) {
  var $ctrl = this;
  $ctrl.ok = function () {
    printCanvas();
    $uibModalInstance.close();
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  function printCanvas() {
    var dataUrl = document.getElementById('canvasX').toDataURL();
    
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
});
