'use strict';

/**
 * @ngdoc service
 * @name certGeneratorWebApp.shared
 * @description
 * # shared
 * Service in the certGeneratorWebApp.
 */
angular.module('certGeneratorWebApp')
  .service('Shared', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var _importData = [];
    var _currentActivity = null;

    function setImportData(data) {
      _importData = data;
    }

    function getImportData() {
      return _importData;
    }

    function setCurrentActivity(data) {
      _currentActivity = data;
    }

    function getCurrentActivity() {
      return _currentActivity;
    }

    function isUndefinedOrNull(value) {
      return (angular.isUndefined(value) || value === '' || value === ' ' || value === null);
    }

    function toCamelCase(str) {
      var f = str.toLowerCase();
      var x = f.replace(/\b\w/g, function (l) { return l.toUpperCase() });
      return x;
    }

    function capitalize(str) { return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1); }


    return {
      setImportData: setImportData,
      getImportData: getImportData,
      isEmpty: isUndefinedOrNull,
      setCurrentActivity: setCurrentActivity,
      getCurrentActivity: getCurrentActivity,
      toCamelCase: toCamelCase
    };

  });
