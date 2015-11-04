(function () {

  'use strict';

  angular.module('cesar-security').constant('USER_ROLES', {
    all: '*',
    admin: 'ROLE_ADMIN',
    speaker: 'ROLE_SPEAKER',
    member: 'ROLE_MEMBRE'
  });


  angular.module('cesar-security').config(function ($httpProvider) {
    'ngInject';

    // alternatively, register the interceptor via an anonymous factory
    $httpProvider.interceptors.push(function ($q, $rootScope) {
      return {
        'responseError': function (response) {
          if (response.status === 401 && !response.config.ignoreErrorRedirection) {
            var deferred = $q.defer();
            $rootScope.$broadcast('event:auth-loginRequired', response);
            return deferred.promise;
          }
          else if (response.status === 403 && !response.config.ignoreErrorRedirection) {
            $rootScope.$broadcast('event:auth-notAuthorized', response);
          }
          // otherwise, default behaviour
          return $q.reject(response);
        }
      };
    });
  });
})();