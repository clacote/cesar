(function () {

  'use strict';

  angular.module('cesar').constant('LANGUAGES', {
    fr: 'fr_FR',
    us: 'us_US'
  });

  angular.module('cesar').config(function ($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider, USER_ROLES, LANGUAGES) {
    'ngInject';

    // Initialize angular-translate
    $translateProvider.useStaticFilesLoader({
      prefix: 'i18n/',
      suffix: '.json'
    });

    $translateProvider.preferredLanguage(LANGUAGES.fr);
    $translateProvider.useCookieStorage();
    $translateProvider.useSanitizeValueStrategy('sanitize');

    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/home');

    // State use to list members
    function stateMember(url, type) {
      return {
        url: '/' + url,
        authorizedRoles: [USER_ROLES.all],
        resolve: {
          members: function (MemberService) {
            return MemberService.getAll(type).then(function (response) {
              return response.data;
            });
          }
        },
        views: {
          main: {
            templateUrl: 'views/members/' + url + '.html',
            controller: 'MembersCtrl',
            controllerAs: 'ctrl'
          }
        }
      };
    }

    // State use to list sessions
    function stateSessions(url) {
      return {
        url: '/' + url,
        authorizedRoles: [USER_ROLES.all],
        views: {
          main: {
            templateUrl: 'views/sessions/' + url + '.html',
            controller: 'SessionsCtrl',
            controllerAs: 'ctrl'
          }
        },
        data: {
          type: url
        }
      };
    }

    // State old editions
    function stateOldEdition(url, year) {
      return {
        url: '/' + url,
        authorizedRoles: [USER_ROLES.all],
        views: {
          main: {
            templateUrl: 'views/sessions/talks.html',
            controller: 'SessionsClosedCtrl',
            controllerAs: 'ctrl'
          }
        },
        data: {
          year: year
        }
      };
    }

    function stateSimplePage(url, template, roles, ctrlName) {
      var state = {
        url: '/' + url,
        authorizedRoles: roles ? roles : [USER_ROLES.all],
        views: {
          main: {
            templateUrl: template
          }
        }
      };
      if (ctrlName) {
        state.views.main.controller = ctrlName;
        state.views.main.controllerAs = 'ctrl';
      }
      return state;
    }

    //Router definition
    $stateProvider
      .state('error', {
        url: '/error/{type}',
        params: {
          error: {}
        },
        views: {
          main: {
            templateUrl: 'views/error.html',
            controller: function ($scope, $stateParams) {
              $scope.error = $stateParams.error;
              $scope.type = $stateParams.type;
            }
          }
        }
      })

      //Home Page
      .state('home', stateSimplePage('home', 'views/home.html'))

      //News
      .state('news', {
        url: '/article/:id',
        resolve: {
          articles: function (ArticleService) {
            return ArticleService.getAll().then(function (response) {
              return response.data;
            });
          }
        },
        views: {
          main: {
            templateUrl: 'views/info/news.html',
            controller: 'ArticleCtrl',
            controllerAs: 'ctrl'
          }
        }
      })
      //News
      .state('articles', {
        url: '/articles',
        authorizedRoles: [USER_ROLES.all],
        resolve: {
          articles: function (ArticleService) {
            return ArticleService.getAll().then(function (response) {
              return response.data;
            });
          }
        },
        views: {
          main: {
            templateUrl: 'views/info/articles.html',
            controller: function(articles){
              var ctrl = this;
              ctrl.articles = articles;
            },
            controllerAs: 'ctrl'
          }
        }
      })

      //Program
      .state('planning', stateSimplePage('planning', 'views/sessions/planning.html'))
      .state('talks', stateSessions('talks', 'talk'))
      .state('lightningtalks', stateSessions('lightningtalks', 'lightningtalks'))
      .state('session', {
        url: '/session/:type/:id',
        authorizedRoles: [USER_ROLES.all],
        resolve: {
          session: function (SessionService, $stateParams) {
            return SessionService.getById($stateParams.id).then(function (response) {
              return response.data;
            });
          }
        },
        views: {
          main: {
            templateUrl: 'views/sessions/session.html',
            controller: 'SessionCtrl',
            controllerAs: 'ctrl'
          }
        }
      })

      //Participants
      .state('speakers', stateMember('speakers', 'speaker'))
      .state('sponsors', stateMember('sponsors', 'sponsor'))
      .state('staff', stateMember('staff', 'staff'))
      .state('member', {
        url: '/member/:type/:id',
        authorizedRoles: [USER_ROLES.all],
        resolve: {
          member: function (MemberService, $stateParams) {
            return MemberService.getById($stateParams.id).then(function (response) {
              return response.data;
            });
          }
        },
        views: {
          main: {
            templateUrl: 'views/members/member.html',
            controller: 'MemberCtrl',
            controllerAs: 'ctrl'
          }
        }
      })

      //Infos
      .state('multimedia', stateSimplePage('multimedia', 'views/info/multimedia.html'))
      .state('conduite', stateSimplePage('conduite', 'views/info/conduite.html'))
      .state('faq', stateSimplePage('faq', 'views/info/faq.html'))
      .state('venir', stateSimplePage('venir', 'views/info/venir.html'))
      .state('mixit15', stateOldEdition('mixit15', 2015))
      .state('mixit14', stateOldEdition('mixit15', 2014))
      .state('mixit13', stateOldEdition('mixit15', 2013))
      .state('mixit12', stateOldEdition('mixit15', 2012))

      //Connected
      .state('favoris', stateSimplePage('favoris', 'views/user/favoris.html', [USER_ROLES.member, USER_ROLES.admin, USER_ROLES.speaker]))
      .state('account', stateSimplePage('account', 'views/user/account.html', [USER_ROLES.member, USER_ROLES.admin, USER_ROLES.speaker]))
      .state('createuseraccount', stateSimplePage('createuseraccount', 'views/user/create-user-account.html', [USER_ROLES.all], 'CreateUserAccountCtrl'))
      .state('useraccountcreated', stateSimplePage('useraccountcreated', 'views/user/user-account-created.html'))
      .state('logout', stateSimplePage('home', 'views/home.html'))
      .state('authent', stateSimplePage('authent', 'views/user/login.html', [USER_ROLES.all], 'LoginCtrl'))
      .state('passwordlost', stateSimplePage('passwordlost', 'views/user/password-lost.html', [USER_ROLES.all], 'ReinitPasswordAccountCtrl'));
  });

})();
