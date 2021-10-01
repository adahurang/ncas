'use strict';

/**
 * @ngdoc function
 * @name certGeneratorWebApp.controller:ImportCtrl
 * @description
 * # ImportCtrl
 * Controller of the certGeneratorWebApp
 */
angular.module('certGeneratorWebApp')
    .controller('ImportCtrl', function($scope, $location, Shared, Api, $http, $uibModal) {
    var vm = this;
    vm.error = '';

    Api.all('activityTypes')
      .then(function (res) {
        vm.types = res;
        if (vm.types.length) {
          vm.typeId = _.first(vm.types).id;
        }
      })
      .catch(function (err) { console.log(err); vm.error = err.message; });
    
    vm.saveImport = function () {
      var obj = document.getElementById('attendantsData');
      var file = angular.element(obj);
      if (Shared.isEmpty(vm.name) || Shared.isEmpty(vm.venue) || Shared.isEmpty(vm.startDate) || Shared.isEmpty(vm.typeId) ||
          Shared.isEmpty(vm.certText1) || Shared.isEmpty(vm.units)) {
        vm.error = 'Fill all required fields to proceed.';
      }
      else if (!file[0].files[0]) {
        vm.error = 'Select excel document with list of attendants to upload.';
      }
      else {    
        parseExcel(file);
        vm.error = '';
        }    
    }
    
    function parseExcel(file) {
        var reader = new FileReader();
        reader.onload = function (e) {
          var data = e.target.result;
          var workbook = XLSX.read(data, { type: 'binary' });
          var XL_row_object = [];
          workbook.SheetNames.forEach(function (sheetName) {
            XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            Shared.setImportData(XL_row_object);
          });
          var newActivity = {
            Title: vm.name,
            Location: vm.venue,
            StartDate: moment(vm.startDate).format('DD-MMM-YYYY'),
            EndDate: vm.endDate ? moment(vm.endDate).format('DD-MMM-YYYY') : null,
            ActivityTypeId: vm.typeId,
            PrintDeadLine: vm.deadLine ? moment(vm.deadLine).format('DD-MMM-YYYY') : null,
            Created: moment().format('DD-MMM-YYYY'),
            CertText1: vm.certText1 || '',
            CertText2: vm.certText2 || '',
            Units: vm.units || ''
          };
          Api.add('Activities', newActivity)
            .then(function (res) {
              Shared.setCurrentActivity(res);
              $location.path('/attendants');
              if (!$scope.$$phase) $scope.$apply();
            })
            .catch(function (err) { console.log(err); vm.error = err.message ? err.message : err.data.message; });
        };

        reader.onerror = function (ex) {
          console.log(ex);
        };

        reader.readAsBinaryString(file[0].files[0]);
    };

    vm.preview = function(size) {
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

        modalInstance.rendered.then(function() {
            var canvas = document.getElementById('canvasX');
            var ctx = canvas.getContext('2d');
            drawCert(ctx, canvas);
        });

        modalInstance.result.then(function(result) {
        }, function() {
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

        if (vm.certText1) {
            var certText1 = vm.certText1.split('\\n');
            ctx.font = "bold 16pt Calibri";
            ctx.fillStyle = "black";
            var startlinePost = 440;
            certText1.forEach(function (line) {
              ctx.fillText(line, canCenter, startlinePost);
                startlinePost = startlinePost + 20;
            });
        }

        if (vm.certText2) {
            var certText2 = vm.certText2.split('\\n');
            ctx.font = "bold 16pt Calibri";
            ctx.fillStyle = "black";
            var startlinePost = 500;
            certText2.forEach(function (line) {
              ctx.fillText(line, canCenter, startlinePost);
                startlinePost = startlinePost + 20;
            });
        }
        ctx.textAlign = 'left';

        if (vm.units) {
          ctx.font = "bold 16pt Calibri";
          ctx.fillStyle = "black";
          ctx.textAlign = 'left';
          var text = 'This is to certify that you attended the sessions described above and earned';
          ctx.fillText(text, 280, 680);
          text = vm.units + ' CLE Hour' + (vm.units != 1 ? 's' : '');
          ctx.fillText(text, 280, 700);
        }
        ctx.font = "30pt Berkshire Swash";
        ctx.fillStyle = "black";
        ctx.drawImage(sec, 0, 0, can.width, can.height);
    }
    })
    .controller('ModalInstanceCtrl', function($uibModalInstance) {
        var $ctrl = this;
        $ctrl.ok = function() {
            $uibModalInstance.close();
        };

        $ctrl.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    });
