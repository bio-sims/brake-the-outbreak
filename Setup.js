//File with setup and initialization code
//To be merged with Epidemiology.js

import file from "./config.json" with { type: "json"};

//function: creating and appending grid of 'canvas' elements
var container = document.getElementById("grid");
container.style.height = (simulation.gridHeight * 52) + 'px';
container.style.width = (simulation.gridWidth * 52) + 'px';

 for (var x = 0; x < simulation.gridHeight; x++) for (var y = 0; y < simulation.gridWidth; y++) {
   let div = document.createElement("canvas");
   var tempStr = `${x} + ${y}`;
   div.id = tempStr;
   div.height = 50;
   div.width = 50;
   container.appendChild(div);
}

//temp: 2D array determining infection
let arr = [];
for (var i = 0; i < simulation.gridHeight; i++) {
  arr[i] = [];
}

//randomly assigning which people are infected
for (var i = 0; i < 100; i++) {
  var x = Math.floor(Math.random() * simulation.gridHeight);
  var y = Math.floor(Math.random() * simulation.gridWidth);
  while(arr[x][y] !== undefined) {
    x = Math.floor(Math.random() * simulation.gridHeight);
    y = Math.floor(Math.random() * simulation.gridWidth);
  }
  arr[x][y] = new Person;
}

//drawing circles for each person
for (var i = 0; i < simulation.gridHeight; i++) {
  for (var j = 0; j < simulation.gridWidth; j++) {
    if(arr[i][j] === undefined) {
      continue;
    }
    var tempStr = `${i} + ${j}`
    var canvas = document.getElementById(tempStr);
    var context = canvas.getContext("2d");
    if(arr[i][j].immune) {
      context.fillStyle = "yellow";
    } else if (arr[i][j].infected) {
      context.fillStyle = "red";
    }
    else {
      context.fillStyle = "blue";
    }
    context.beginPath();
    context.arc(25, 25, 20, 0, 2 * Math.PI);
    context.fill();
  }
}
