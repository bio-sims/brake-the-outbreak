//Epidemiology Simulation Project: Anna Muller,
//                                 Rena Ahn
//To be merged with Epidemiology.js

import file from "./config.json" with { type: "json"};

//declaring simulation variables
var gridInput = document.getElementById("gridSlider");
var maskInput = document.getElementById("maskText");
var vaccInput = document.getElementById("vaccText");
var submitButton = document.getElementById("submitBtn");

submitButton.addEventListener("click", redrawGrid, true);

function drawGrid(height, width) {
  //function: creating and appending grid of 'canvas' elements
  var container = document.getElementById("grid");
  container.style.height = (height * 52) + 'px';
  container.style.width = (width * 52) + 'px';

  for (var x = 0; x < height; x++) for (var y = 0; y < width; y++) {
    let div = document.createElement("canvas");
    var tempStr = `${x} + ${y}`;
    div.id = tempStr;
    div.height = 50;
    div.width = 50;
    container.appendChild(div);
  }

  //temp: 2D array determining infection
  let arr = [];
  for (var i = 0; i < height; i++) {
    arr[i] = [];
  }

  //randomly assigning which people are infected
  for (var i = 0; i < 100; i++) {
    var x = Math.floor(Math.random() * height);
    var y = Math.floor(Math.random() * width);
    while (arr[x][y] !== undefined) {
      x = Math.floor(Math.random() * height);
      y = Math.floor(Math.random() * width);
    }
    arr[x][y] = new Person;
  }

  //drawing circles for each person
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      if (arr[i][j] === undefined) {
        continue;
      }
      var tempStr = `${i} + ${j}`
      var canvas = document.getElementById(tempStr);
      var context = canvas.getContext("2d");
      if (arr[i][j].immune) {
        context.fillStyle = "yellow";
      } else if (arr[i][j].infected) {
        context.fillStyle = "red";
      } else {
        context.fillStyle = "blue";
      }
      context.beginPath();
      context.arc(25, 25, 20, 0, 2 * Math.PI);
      context.fill();
    }
  }
}

function redrawGrid() {
  var container = document.getElementById("grid");
  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild);
  }
  drawGrid(gridInput.value, gridInput.value);
}

drawGrid(gridInput.value, gridInput.value);
