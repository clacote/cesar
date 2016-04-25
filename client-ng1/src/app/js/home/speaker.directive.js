(function () {

  'use strict';

  angular.module('cesar-home').directive('cesarHomeSpeaker', function () {
    'ngInject';

    return {
      templateUrl: 'js/home/speaker.directive.html',
      scope: {},
      controller: function ($scope) {
        $scope.speakers = [{
          id: 2841,
          name: 'Dan North',
          hash: '33cfb4d051a768c06f7fb380c7c2abe3'
        }, {
          id: 9,
          name: 'Pamela Fox',
          hash: '92dfeb863138a5a9c0453ed80f9c8c75'
        }, {
          id: 1005,
          name: 'Matti Schneider',
          hash: '3a06762591a19586422a38e508057850'
        }, {
          id: 274,
          name: 'Bodil Stokke',
          hash: 'f9f8e0403b0437662bdbc2b4e9c6ccf3'
        }, {
          id: 564,
          name: 'Zach Holman',
          hash: '78b475797a14c84799063c7cd073962f'
        }, {
          id: 994,
          name: 'Tristan Nitot',
          hash: '3ac6bd8f5222fed869d6fd03314e25af'
        }, {
          id: 2441,
          name: 'Dan Allen',
          hash: 'dcccd96c499963133f7f95e7ffa20c4e'
        }, {
          id: 7962,
          name: 'Tim Urban',
          image: 'img/speakers/urban.jpg'
        }, {
          id: 5872,
          name: 'Katrina Owen',
          hash: '51ee7bed9ecbc33aec92517f1fbb6cc2'
        }, {
          id: 175,
          name: 'Alexandre Boutin',
          hash: '5ca832c4941c23a218c7c73210aafedb'
        }, {
          id: 965,
          name: 'Pierre Pezziardi',
          hash: '9c25461b4ffd3397d0194c4a43b5e33f'
        }, {
          id: 591,
          name: 'Svetlana Isakova',
          hash: 'c49d50cfdedcf450cd704ad3340f0609'
        }];
      }
    };
  });
})();

