(function () {

  'use strict';

  angular.module('cesar-security').controller('LoginCtrl', function (AuthenticationService) {
    'ngInject';

    var ctrl = this;

    ctrl.login = function(){
      if(ctrl.credentials){
        AuthenticationService.login(ctrl.credentials);
      }
    };

    ctrl.loginWithGoogle = function(){
      AuthenticationService.loginWithProvider('GOOGLE');
    };

    ctrl.loginWithTwitter = function(){
      AuthenticationService.loginWithProvider('TWITTER');
    };

  });

})();