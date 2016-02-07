(function () {

  'use strict';
  /*global moment */

  angular.module('cesar-planning').factory('PlanningService', function ($http, $q) {
    'ngInject';

    var DATE_FORMAT = 'YYYY-MM-DD HH:mm';

    function getRoom() {
      return $http.get('/api/planning/room');
    }

    function getSlots(year) {
      return $http.get('/api/planning' + (!!year ? '?year=' + year : ''));
    }

    /**
     * Set the moment
     */
    function setTime(moment, time) {
      var myTime = moment.clone();
      myTime.set('hour', time.hour);
      myTime.set('minute', time.minute);
      myTime.set('second', 0);
      myTime.set('millisecond', 0);
      return myTime;
    }

    function createSlot(start, end){
      return {
        start: start.format(DATE_FORMAT),
        end: end.format(DATE_FORMAT),
        duration: moment.duration(end.diff(start)).as('minutes')
      };
    }

    /**
     * This function computes the set of time slices available between two hours. The goal
     * is to return a table with a data for each new hour
     */
    function computeRange(instant, startTime, endTime) {
      if(!startTime || !endTime){
        instant = instant ? instant : moment();
        startTime = {hour: 8, minute: 0};
        endTime = {hour: 19, minute: 0};
      }
      var start, end;
      var range = [];

      var time = {
        hour: startTime.hour,
        minute: startTime.minute
      };

      if (time.hour === endTime.hour && time.minute !== endTime.minute) {
        start = setTime(instant, time);
        end = setTime(instant, endTime);
        return [createSlot(start,end)];
      }

      while (time.hour < endTime.hour) {
        start = setTime(instant, time);
        time.hour++;
        time.minute = 0;
        end = setTime(instant, time);

        range.push(createSlot(start,end));

        if (time.hour === endTime.hour && time.minute !== endTime.minute) {
          start = setTime(instant, time);
          time.minute = endTime.minute;
          end = setTime(instant, time);

          range.push(createSlot(start,end));
        }
      }
      return range;
    }

    /**
     * Set the moment
     */
    function putRange(slots, ranges) {
      if (ranges) {
        ranges.forEach(function (range) {
          slots.push(range);
        });
      }
    }

    /**
     * Slots are read in database and a table is build to be able to display a nice planning
     */
    function computeSlots(eventDate, slotInDatabase, rooms) {
      var slotsByRoom = slotInDatabase;

      if (rooms) {
        rooms.forEach(function (room) {
          //We see if slots exists for this room
          if (!slotsByRoom[room.key]) {
            slotsByRoom[room.key] = computeRange(moment(eventDate), {hour: 8, minute: 0}, {hour: 19, minute: 0});
          }
          else {
            var slots = [], elt, time;
            var lastTime = {
              hour: 8,
              minute: 0
            };

            for (var i in slotsByRoom[room.key]) {
              elt = slotsByRoom[room.key][i];

              time = {
                hour: moment(elt.start).get('hour'),
                minute: moment(elt.start).get('minute')
              };

              if (time.hour !== lastTime.hour || time.minute !== lastTime.minute) {
                putRange(slots, computeRange(moment(elt.start), lastTime, time));
              }

              elt.duration = moment.duration(moment(elt.end).diff(moment(elt.start))).as('minutes');
              slots.push(elt);

              lastTime = {
                hour: moment(elt.end).get('hour'),
                minute: moment(elt.end).get('minute')
              };
            }

            //For the last one we have to verify the last range
            if (lastTime.hour < 19) {
              putRange(slots, computeRange(moment(elt.start), lastTime, {hour: 19, minute: 0}));
            }
            slotsByRoom[room.key] = slots;
          }
        });
      }
      return $q.when(slotsByRoom);
    }

    function sessionExist(slots, session){
      return slots.filter(function(slot){
          if(session.idSession===711 && slot.session)
            console.log(slot.session.id, session.idSession, slot.session.id === session.idSession)
        return (slot.session && slot.session.id === session.idSession);
      }).length>0;
    }
    /**
     * Extract the sessions not affected in a planning slot
     */
    function extractSessionToAffect(slotInDatabase, sessions){
      if(!sessions || !slotInDatabase){
        return undefined;
      }
      return sessions.filter(function(session){
        var notExist = true;
        Object.keys(slotInDatabase).forEach(function(key){
          if(sessionExist(slotInDatabase[key], session) && notExist){
            notExist = false;
          }
        });
        return notExist;
      });
    }

    function getTimeSlot(date, hour, minute){
      var momentDate = setTime(date, { hour : hour, minute : minute});
      return {
        key : momentDate.format(DATE_FORMAT),
        label : momentDate.format('HH:mm')
      };
    }

    function getTimeSlots(date){
      var momentDate = moment(date);
      var slots = [];

      for(var h=8 ; h<19 ; h++){
        for(var min=0 ; min<6 ; min++){
          slots.push(getTimeSlot(momentDate, h, min*10));
        }
      }

      return slots;
    }

    return {
      getRoom: getRoom,
      getSlots: getSlots,
      getTimeSlots: getTimeSlots,
      computeSlots: computeSlots,
      computeRange: computeRange,
      extractSessionToAffect: extractSessionToAffect
    };
  });
})();