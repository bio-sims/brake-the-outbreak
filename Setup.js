//Epidemiology Simulation Project: Rena Ahn and Anna Muller
//To be merged with Epidemiology.js

import file from "./config.json" with { type: "json"};

//Person class
class Person {
  Person() {
    this.protNum = 0.5;
    this.transNum = 0.5;
    this.daysInfected = 0;
    this.immune = False;
    this.infected = False;
  }
}

//declaring and initializing user input variables
var gridInput = document.getElementById("gridSlider");
var maskInput = document.getElementById("maskText");
var vaccInput = document.getElementById("vaccText");
var submitButton = document.getElementById("submitBtn");  //refer to index.html, input element with id="sumbitBtn"

//Event Listener: when the submit button is clicked on, the redrawGrid function is called
submitButton.addEventListener("click", redrawGrid);

//Creates the necessary canvas elements and uses them to build a grid
//A 2D array representing grid is made then randomly populated with people using Math.floor and Math.random
//A circle is drawn by the cell in the position as represented by the 2D array, linking the array to the grid
//   The color of the circle represents the person's infection status...
//      blue: not infected
//      red: infected
//      yellow: immune
//      ...(further additions/specifications?)...
//Pre-condition: height and width are integers between 12 and 15
//Post-condition: the grid container is filled with (height) by (width) canvas elements,
//                a hundred of those elements having a circle which represents a person
function drawGrid(height, width) {
  var container = document.getElementById("grid");  //refer to index.html, div element with id="grid"
  //sets the height and width of the grid accordingly
  container.style.height = (height * 52) + 'px';
  container.style.width = (width * 52) + 'px';

  for (var x = 0; x < height; x++) for (var y = 0; y < width; y++) {
    let div = document.createElement("canvas");  //creates a canvas element which represents a cell of the grid
    var tempStr = `${x} + ${y}`;  //creates the id for the canvas element
    div.id = tempStr;
    div.height = 50;
    div.width = 50;
    container.appendChild(div);  //the canvas element (div) is added to the grid (container)
  }

  //declaring 2D Array that will hold people
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
      //if there is no person, continue
      if (arr[i][j] === undefined) {
        continue;
      }
      var tempStr = `${i} + ${j}`  //the id for the canvas element
      var canvas = document.getElementById(tempStr);  //access the canvas elements created using their id
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

//Deletes the current canvas elements in the grid
//Then calls the drawGrid function to redraw the grid to the size determined by user input
function redrawGrid() {
  var container = document.getElementById("grid");  //refer to index.html, div element with id="grid"
  //empties out the grid of canvas element cells
  while (container.hasChildNodes()) {  //the canvas elements are the child nodes
    container.removeChild(container.firstChild);
  }
  drawGrid(gridInput.value, gridInput.value);  //calls the drawGrid function with the newly updated grid size
}

drawGrid(gridInput.value, gridInput.value);  //calls the drawGrid function with the initial default grid size 15
