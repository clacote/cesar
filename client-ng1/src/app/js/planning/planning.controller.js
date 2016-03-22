(function () {

  'use strict';

  angular.module('cesar-planning').controller('PlanningCtrl', function ($rootScope, $q, $http, $filter, SessionService, PlanningService, MemberService, shuffleService, cesarSpinnerService) {
    'ngInject';

    var ctrl = this;
    var sessions, transversalSlots, speakers;

    //TODO il faut que les params de filtre puissent être mis dans l'URL

    cesarSpinnerService.wait();

    //We need to load sessions, speakers and transversal slots
    $q.all([
        PlanningService.getRoom().then(function (response) {
          ctrl.rooms = response.data;
        }),
        SessionService
          .getAllByYear()
          .then(function (response) {
            if (response.data) {
              sessions = response.data.filter(function (elt) {
                return elt.start;
              });
            }
            else {
              sessions = [];
            }
          }),
        PlanningService.getTransversalSlots().then(function (response) {
          transversalSlots = response.data;
        }),
        MemberService.getAll('speaker')
          .then(function (response) {
            speakers = response.data;
          })
      ])
      .then(function () {
        if (transversalSlots) {
          transversalSlots.forEach(function (elt) {
            var session = {
              title: elt.label,
              end: elt.end,
              start: elt.start
            };
            if (elt.room) {
              session.room = elt.room;
            }
            sessions.push(session);
          });
        }
        ctrl.sessions = sessions.filter(function (elt) {
          return elt.start;
        });
        SessionService.findSessionsSpeakers(ctrl.sessions, speakers);
        ctrl.updateData();
      })
      .finally(function () {
        cesarSpinnerService.stopWaiting();
      });

    ctrl.shuffle = shuffleService.createShuffle('start');

    ctrl.updateData = function(){
      var sess = angular.copy(ctrl.sessions);
      if(ctrl.slot){
        if(ctrl.slot.room && ctrl.slot.room.name){
          sess = $filter('filter')(sess, ctrl.slot.room.name);
        }
        if(angular.isDefined(ctrl.slot.format)){
          sess = $filter('filter')(sess, ctrl.slot.format);
        }
      }
      ctrl.shuffle.set(sess);
    };

  });
})();
