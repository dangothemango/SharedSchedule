$(function() {
  const scheduleSocket = io('/scheduler');
  scheduleSocket.on('weeks', function(weeks) {
    vueData.weeks = weeks;
  });
  scheduleSocket.emit('init-scheduler');

  const peopleSocket = io('/people')
  peopleSocket.on('people', function(people) {
    vueData.people = people
  })
  peopleSocket.emit("get-people")

  const vueData = {
    selectedPerson: null,
    weeks: [],
    people: [],
    comment: ''
  };

  new Vue({
    el: '#app',
    data: vueData,
    methods: {
      dayClasses: function(day) {
        const today = new Date();
        const isPast = day.month < today.getMonth() || (day.month === today.getMonth()  && day.number < today.getDate());
        return {
          'calendar-past': isPast,
          'calendar-today': today.getDate() === day.number && today.getMonth() === day.month
        };
      },
      dayTitle: function(day) {
        return ((day.number === 1) ? day.monthName + ' ' : '') + day.number;
      },
      selectDay: function(selectedDay) {
        if (!vueData.selectedPerson) {
          return;
        }
        let foundIndex = -1;
        selectedDay.people.forEach(function(person, i) {
          if (person.name === vueData.selectedPerson.name) {
            foundIndex = i;
          }
        });
        if (foundIndex === -1) {
          selectedDay.people.push(vueData.selectedPerson);
          selectedDay.people[selectedDay.people.length - 1].comment = vueData.comment
        } else {
          selectedDay.people.splice(foundIndex, 1);
        }
        selectedDay.people = selectedDay.people.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          } else if (a.name < b.name) {
            return -1;
          } else {
            return 0;
          }
        });
        scheduleSocket.emit('weeks', vueData.weeks);
      }
    }
  });
});
