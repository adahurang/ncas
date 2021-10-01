'use strict';

/**
 * @ngdoc service
 * @name certGeneratorWebApp.api
 * @description
 * # api
 * Service in the certGeneratorWebApp.
 */
angular.module('certGeneratorWebApp')
  .service('Api', function ($http, $q) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    
   // var URL = 'http://ncas.nigerianbar.org.ng/api/api/';
    var URL = 'https://certgenerator20210825132735.azurewebsites.net/api/';
    function all(entity) {
      var requestURL = URL + entity;
      return $http.get(requestURL)
        .then(function (res) {
          return res.data;
        })
        .catch(function (res) {
          return $q.reject(res);
        });
    }

    function getByAction(entity, action) {
      var requestURL = URL + entity + "/" + action;
      return $http.get(requestURL)
        .then(function (res) {
          return res.data;
        })
        .catch(function (res) {
          return $q.reject(res);
        });
    }

    function getById(entity, id) {
      var requestURL = URL + entity + "/" + id;
      return $http.get(requestURL)
        .then(function (res) {
          return res.data;
        })
        .catch(function (res) {
          return $q.reject(res);
        });
    }

    function addByAction(entity, action, payload) {
      var requestURL = URL + entity + "/" + action + "/v1";
      return $http.post(requestURL, payload)
        .then(function (res) {
          return res.data;
        })
        .catch(function (res) {
          return $q.reject(res);
        });
    }

    function getByActionId(entity, action, id) {
      var requestURL = URL + entity + "/" + action + "/" + id;
      return $http.get(requestURL)
        .then(function (res) {
          return res.data;
        })
        .catch(function (res) {
          return $q.reject(res);
        });
    }

    function add(entity, payload) {
      var requestURL = URL + entity;
      return $http.post(requestURL, payload)
        .then(function (res) {
          return res.data;
        })
        .catch(function (res) {
          return $q.reject(res);
        });
    }

    function edit(entity, payload) {
      var requestURL = URL + entity;
      return $http.put(requestURL, payload)
        .then(function (res) {
          return res.data;
        })
        .catch(function (res) {
          return $q.reject(res);
        });
    }

    function editByAction(entity, action, id) {
      var requestURL = URL + entity + "/" + action + "/" + id;
      return $http.put(requestURL, id)
        .then(function (res) {
          return res.data;
        })
        .catch(function (res) {
          return $q.reject(res);
        });
    }

    function deleted(entity, payload) {
      var requestURL = URL + entity + '/' + payload;
      return $http.delete(requestURL, payload)
        .then(function (res) {
          return res.data;
        })
        .catch(function (res) {
          return $q.reject(res);
        });
    }
function deletedByAction(entity, action, payload) {
      var requestURL = URL + entity + "/" + action + "/v1";
      return $http.delete(requestURL, payload)
        .then(function (res) {
          return res.data;
        })
        .catch(function (res) {
          return $q.reject(res);
        });
}

    function approveActivity(id) {
      var requestURL = URL + "activities/approve/" + id;
      return $http.post(requestURL, id)
        .then(function (res) {
          return res.data;
        })
        .catch(function (res) {
          return $q.reject(res);
        });
    }


    return {
      all: all,
      getByActionId: getByActionId,
      getByAction: getByAction,
      add: add,
      addByAction: addByAction,
      edit: edit,
      deleted: deleted,
      deletedByAction: deletedByAction,
      approveActivity: approveActivity,
      editByAction: editByAction,
      getById: getById
    };
  });
