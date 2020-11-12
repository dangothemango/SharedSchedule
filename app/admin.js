Colors = {};
Colors.names = {
    aqua: "#00ffff",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    black: "#000000",
    blue: "#0000ff",
    brown: "#a52a2a",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgrey: "#a9a9a9",
    darkgreen: "#006400",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkviolet: "#9400d3",
    fuchsia: "#ff00ff",
    gold: "#ffd700",
    green: "#008000",
    indigo: "#4b0082",
    khaki: "#f0e68c",
    lightblue: "#add8e6",
    lightcyan: "#e0ffff",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    magenta: "#ff00ff",
    maroon: "#800000",
    navy: "#000080",
    olive: "#808000",
    orange: "#ffa500",
    pink: "#ffc0cb",
    purple: "#800080",
    violet: "#800080",
    red: "#ff0000",
    silver: "#c0c0c0",
    white: "#ffffff",
    yellow: "#ffff00"
};
Colors.random = function() {
    var result;
    var count = 0;
    for (var prop in this.names)
        if (Math.random() < 1/++count)
            result = prop;
    return { name: result, rgb: this.names[result]};
};

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

$(function() {
    const socket = io('/people');
    socket.on('people', function(people) {
      vueData.people = people;
    });
    socket.emit('get-people');
  
    const vueData = {
      people: [],
      name: ''
    };
  
    new Vue({
      el: '#app',
      data: vueData,
      methods: {
        addPerson: function() {
          let foundIndex = -1;
          vueData.people.forEach(function(person, i) {
            if (person.name === vueData.name) {
              foundIndex = i;
            }
          });
          if (foundIndex !== -1) {
            alert("This person already exists");
            return;
          }
          let color = Colors.random().rgb
          let rgb = hexToRgb(color)
          let textColor =((rgb.r*0.299 + rgb.g*0.587 + rgb.b*0.114) > 220) ? "#000000" : "#ffffff";
          vueData.people.push({
            name:vueData.name,
            style: {
              backgroundColor: color,
              color: textColor
            }
          });
          socket.emit("people", vueData.people)
        },
        deletePerson: function(name) {
          let foundIndex = -1;
          vueData.people.forEach(function(person, i) {
            if (person.name === name) {
              foundIndex = i;
            }
          });
          if (foundIndex !== -1) {
            vueData.people.splice(foundIndex, 1);
          }
          socket.emit("people", vueData.people)
        }
      }
    });
  });
