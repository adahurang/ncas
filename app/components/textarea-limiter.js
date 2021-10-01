"use strict";

angular.module('certGeneratorWebApp')
    .directive('textareaLimiter', function () {
        return {
            restrict: 'E',
            scope: {
                ngModel: '=',
                rows: '@',
                placeholder: '@'
            },
            link: function (scope, elem, attr) {
                var textbox = angular.element(elem[0].querySelector('textarea'));
                var label = angular.element(elem[0].querySelector('label'));
                label[0].textContent = '0/' + attr.max;
                elem.bind('keyup keypress', function (e) {
                    e = e || window.event;
                    if (textbox[0].value.length >= attr.max) {
                        e.preventDefault();
                    }
                    label[0].textContent = textbox[0].value.length + '/' + attr.max;
                });
            },
            templateUrl: 'components/textarea-limiter.html'
        };
    });