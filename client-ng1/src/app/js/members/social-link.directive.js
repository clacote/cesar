(function () {

  'use strict';

  angular.module('cesar-members').directive('cesarSocialLink', function () {
    'ngInject';

    return {
      templateUrl: 'js/members/social-link.directive.html',
      scope: {
        classNames: '@',
        url: '='
      },
      controller: function ($scope) {
        if ($scope.url && $scope.url.indexOf('twitter') > 0) {
          $scope.imgtype = 'twitter';
        }
        else if ($scope.url && $scope.url.indexOf('google') > 0) {
          $scope.imgtype = 'google';
        }
      }
    };
  });
})();
