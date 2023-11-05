//Epidemiology Simulation Project: Rena Ahn and Anna Muller
//Merged with Epidemiology.js [last update: 11/4/2023]
//     Implemented using Math.floor(Math.random()) not npm install seedrandom

//Person class
class Person {
  constructor(num) {
    this.num = num;
    this.transmission = 50;
    this.protection = 50;
    this.mask = false;
    this.vaccine = false;
    this.infectStatus = false;
    this.timeInfect = 0;
    this.immuneStatus = false;
    this.xCoordinate = 0;
    this.yCoordinate = 0;
  }

  // Setter method
  setGridPosition(xCoordinate, yCoordinate) {
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
  }

  // updates stats that have to do with being infected
  infectPerson() {
    this.infectStatus = true;
    this.transmission += simulation.disease.rNot;
    this.timeInfect = 1;
  }
}

//Disease class
class Disease {
  constructor(rNot, vaccEff, daysToSx, daysToImmune) {
    this.rNot = rNot;
    this.vaccEff = vaccEff;
    this.daysToSx = daysToSx;
    this.daysToImmune = daysToImmune;
  }
}
const diseaseDictionary = {
  "leastInfectious": new Disease(20, 25, 2, 12), // covid inspired
  "mediumInfectious": new Disease(30, 30, 7, 14), // rubella inspired
  "mostInfectious": new Disease(40, 35, 4, 8) // measles inspired    
}

// Desc : Depending on the setting, number of people who wear masks
const maskDictionary = {
  "noMask": 0,
  "lowMask": 25,
  "mediumMask": 50,
  "highMask": 75,
  "extremeMask": 90
};

// Desc : Depending on setting, number of people who got the vaccine
const vaccineDictionary = {
  "noVacc": 0,
  "lowVacc": 25,
  "mediumVacc": 50,
  "highVacc": 75,
  "extremeVacc": 90
};

class Grid {
  constructor(gridHeight, gridWidth) {
    this.grid = [];
    this.gridHeight = gridHeight;
    this.gridWidth = gridWidth;
  }

  // Desc : builds the 2D grid based on its given height and width from Simulation
  build() {
    for (var i = 0; i < this.gridHeight; i++) {
      this.grid[i] = [];
      for (var j = 0; j < this.gridWidth; j++) {
        this.grid[i][j] = 0;
      }
    }

    var container = document.getElementById("grid");
    //refer to index.html, div element with id="grid"
    container.style.height = (this.gridHeight * 52) + 'px';
    container.style.width = (this.gridWidth * 52) + 'px';

    for (var x = 0; x < this.gridHeight; x++) for (var y = 0; y < this.gridWidth; y++) {
      var div = document.createElement("canvas");
      //creates a canvas element which represents a cell of the grid
      var tempStr = `${x} + ${y}`;
      //creates the id for the canvas element
      div.id = tempStr;
      div.height = 50;
      div.width = 50;
      container.appendChild(div);
      //the canvas element (div) is added to the grid (container)
    }
  }

  // Desc : hardcodes Patient Zero and its surrouding 8 contacts according to the given patient zero position in Simulation
  setPatientZero(totalPopulation, disease) {
    var patientZero = totalPopulation[0];
    patientZero.setGridPosition(simulation.patientZeroPosition[0], simulation.patientZeroPosition[1]);
    patientZero.infectPerson(disease);
    this.grid[patientZero.xCoordinate][patientZero.yCoordinate] = patientZero;

    var adjPerson1 = totalPopulation[1];
    adjPerson1.setGridPosition(simulation.patientZeroPosition[0] - 1, simulation.patientZeroPosition[1] - 1);
    this.grid[adjPerson1.xCoordinate][adjPerson1.yCoordinate] = adjPerson1;

    var adjPerson2 = totalPopulation[2];
    adjPerson2.setGridPosition(simulation.patientZeroPosition[0] - 1, simulation.patientZeroPosition[1]);
    this.grid[adjPerson2.xCoordinate][adjPerson2.yCoordinate] = adjPerson2;

    var adjPerson3 = totalPopulation[3];
    adjPerson3.setGridPosition(simulation.patientZeroPosition[0] - 1, simulation.patientZeroPosition[1] + 1);
    this.grid[adjPerson3.xCoordinate][adjPerson3.yCoordinate] = adjPerson3;

    var adjPerson4 = totalPopulation[4];
    adjPerson4.setGridPosition(simulation.patientZeroPosition[0], simulation.patientZeroPosition[1] - 1);
    this.grid[adjPerson4.xCoordinate][adjPerson4.yCoordinate] = adjPerson4;

    var adjPerson5 = totalPopulation[5];
    adjPerson5.setGridPosition(simulation.patientZeroPosition[0], simulation.patientZeroPosition[1] + 1);
    this.grid[adjPerson5.xCoordinate][adjPerson5.yCoordinate] = adjPerson5;

    var adjPerson6 = totalPopulation[6];
    adjPerson6.setGridPosition(simulation.patientZeroPosition[0] + 1, simulation.patientZeroPosition[1] - 1);
    this.grid[adjPerson6.xCoordinate][adjPerson6.yCoordinate] = adjPerson6;

    var adjPerson7 = totalPopulation[7];
    adjPerson7.setGridPosition(simulation.patientZeroPosition[0] + 1, simulation.patientZeroPosition[1]);
    this.grid[adjPerson7.xCoordinate][adjPerson7.yCoordinate] = adjPerson7;

    var adjPerson8 = totalPopulation[8];
    adjPerson8.setGridPosition(simulation.patientZeroPosition[0] + 1, simulation.patientZeroPosition[1] + 1);
    this.grid[adjPerson8.xCoordinate][adjPerson8.yCoordinate] = adjPerson8;
  }

  // Desc : sets the position of the rest of the population
  setPopulation(totalPopulation) {
    var i = 9;
    while (i < totalPopulation.length) {
      var randomX = Math.floor(Math.random() * this.gridHeight);
      var randomY = Math.floor(Math.random() * this.gridWidth);
      if (this.grid[randomX][randomY] === 0) {
        totalPopulation[i].setGridPosition(randomX, randomY);
        this.grid[randomX][randomY] = totalPopulation[i];
        i++;
      }
    }
  }

  // Desc : prints the board, only for command line
  drawGrid() {
    for (var i = 0; i < this.gridHeight; i++) {
      for (var j = 0; j < this.gridWidth; j++) {
        var tempStr = `${i} + ${j}`;
        var canvas = document.getElementById(tempStr);
        var context = canvas.getContext("2d");
        if (this.grid[i][j] === 0) {
          context.clearRect(0, 0, context.height, context.width)
          continue;
        }

        if (this.grid[i][j].immune) {
          context.fillStyle = "green";
        } else if (this.grid[i][j].infected) {
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

  //Desc : clears the board and updates gridHeight and gridWidth
  reset(height, width) {
    this.grid = [];
    this.gridHeight = height;
    this.gridWidth = width;
  }
}

const simulation = {
  "simulationLength": 31,
  "gridHeight": 15,
  "gridWidth": 15,
  "seed": "15x15",
  "patientZeroPosition": [7, 5],
  "populationSize": 100,
  "disease": diseaseDictionary.leastInfectious,
  "maskLevel": maskDictionary.mediumMask,
  "maskProtection": 10,
  "vaccLevel": vaccineDictionary.mediumVacc
}

// Desc : returns a list of randomly chosen people
function getRandomList(totalPopulation, length) {
  const listPeople = [];
  var i = 0;
  while (i < length) {
    const person = totalPopulation[Math.floor(Math.random() * totalPopulation.length)];
    if (!listPeople.includes(person)) {
      listPeople.push(person);
      i++;
    }
  }
  return listPeople;
}

// Desc : changes stats of the given list and gives them a mask
function assignMasks(maskedPeople) {
  for (var i = 0; i < maskedPeople.length; i++) {
    maskedPeople[i].mask = true;
    maskedPeople[i].protection += simulation.maskProtection;
    maskedPeople[i].transmission -= simulation.maskProtection;
  }
}

// Desc : changes stats of the given list and gives them vaccines
function assignVacc(vaccPeople) {
  for (var i = 0; i < vaccPeople.length; i++) {
    vaccPeople[i].vaccine = true;
    vaccPeople[i].protection += simulation.disease.vaccEff;
    vaccPeople[i].transmission -= simulation.disease.vaccEff;
  }
}

// Desc : makes two lists and gives them either masks or vaccines (or both)
function setPopulationStats() {
  const maskedPeople = getRandomList(totalPopulation, simulation.maskLevel);
  assignMasks(maskedPeople);
  const vaccPeople = getRandomList(totalPopulation, simulation.vaccLevel);
  assignVacc(vaccPeople);
  return totalPopulation;
}

//declaring and initializing user input variables
var gridInput = document.getElementById("gridSlider");
var maskInput = document.getElementById("maskText");
var vaccInput = document.getElementById("vaccText");
var submitButton = document.getElementById("submitBtn");
//refer to index.html, input element with id="sumbitBtn"

//Event Listener: when the submit button is clicked on, the redrawGrid function is called
submitButton.addEventListener("click", redrawGrid);

//Deletes the current canvas elements in the grid
//Then calls the drawGrid function to redraw the grid to the size determined by user input
function redrawGrid() {
  var container = document.getElementById("grid");
  //refer to index.html, div element with id="grid"
  //empties out the grid of canvas element cells
  while (container.hasChildNodes()) {
    container.removeChild(container.firstChild);
  }

  simulation.gridHeight = gridInput.value;
  simulation.gridWidth = gridInput.value;
  simulation.maskProtection = maskInput.value;
  //how to do vaccine levels...?

  //buildGrid(simulation.gridHeight, simulation.gridWidth)
  town.reset(simulation.gridHeight, simulation.gridWidth);
  town.build();
  town.setPatientZero(totalPopulation, simulation.disease);
  town.setPopulation(totalPopulation);
  setPopulationStats();
  town.drawGrid(simulation.gridHeight, simulation.gridWidth);
}


// Desc : makes the list of people 
const totalPopulation = [];
for (var i = 0; i < simulation.populationSize; i++) {
  totalPopulation.push(new Person(i));
}

// Desc : builds the board before the simulation begins
const town = new Grid(simulation.gridHeight, simulation.gridWidth);
town.build();
town.setPatientZero(totalPopulation, simulation.disease);
town.setPopulation(totalPopulation);
setPopulationStats();
town.drawGrid(simulation.gridHeight, simulation.gridWidth);

var day = 1;
while (day < simulation.simulationLength) {
  const attackerList = [];
  for (var i = 0; i < totalPopulation.length; i++) {
    if (totalPopulation[i].infectStatus == true) {
      attackerList.push(totalPopulation[i]);
    }
  }
  const defenderList = [];
  for (var i = 0; i < attackerList.length; i++) {
    var attackerX = attackerList[i].xCoordinate;
    var attackerY = attackerList[i].yCoordinate;

    if (town.grid[attackerX - 1][attackerY - 1] != 0 && town.grid[attackerX - 1][attackerY - 1].infectStatus == false) {
      defenderList.push(town.grid[attackerX - 1][attackerY - 1]);
      infect(attackerList[i], defenderList[defenderList.length - 1]);
    }
    if (town.grid[attackerX - 1][attackerY] != 0 && town.grid[attackerX - 1][attackerY].infectStatus == false) {
      defenderList.push(town.grid[attackerX - 1][attackerY]);
      infect(attackerList[i], defenderList[defenderList.length - 1]);
    }
    if (town.grid[attackerX - 1][attackerY + 1] != 0 && town.grid[attackerX - 1][attackerY + 1].infectStatus == false) {
      defenderList.push(town.grid[attackerX - 1][attackerY + 1]);
      infect(attackerList[i], defenderList[defenderList.length - 1]);
    }
    if (town.grid[attackerX][attackerY - 1] != 0 && town.grid[attackerX][attackerY - 1].infectStatus == false) {
      defenderList.push(town.grid[attackerX][attackerY - 1]);
      infect(attackerList[i], defenderList[defenderList.length - 1]);
    }
    if (town.grid[attackerX][attackerY + 1] != 0 && town.grid[attackerX][attackerY + 1].infectStatus == false) {
      defenderList.push(town.grid[attackerX][attackerY + 1]);
      infect(attackerList[i], defenderList[defenderList.length - 1]);
    }
    if (town.grid[attackerX + 1][attackerY - 1] != 0 && town.grid[attackerX + 1][attackerY - 1].infectStatus == false) {
      defenderList.push(town.grid[attackerX + 1][attackerY - 1]);
      infect(attackerList[i], defenderList[defenderList.length - 1]);
    }
    if (town.grid[attackerX + 1][attackerY] != 0 && town.grid[attackerX + 1][attackerY].infectStatus == false) {
      defenderList.push(town.grid[attackerX + 1][attackerY]);
      infect(attackerList[i], defenderList[defenderList.length - 1]);
    }
    if (town.grid[attackerX + 1][attackerY + 1] != 0 && town.grid[attackerX + 1][attackerY + 1].infectStatus == false) {
      defenderList.push(town.grid[attackerX + 1][attackerY + 1]);
      infect(attackerList[i], defenderList[defenderList.length - 1]);
    }
  }
  drawGrid(simulation.gridHeight, simulation.gridWidth);
}
// ! while loop end

function transmitDisease(totalPopulation, grid) {
  const attackerList = [];
  for (var i = 0; i < totalPopulation.length; i++) {
    if (totalPopulation[i].infectStatus == true) {
      attackerList.push(totalPopulation[i]);
    }
  }
  const defenderList = [];
  for (var i = 0; i < attackerList.length; i++) {
    var attackerX = attackerList[i].xCoordinate;
    var attackerY = attackerList[i].yCoordinate;

    if (grid[attackerX - 1][attackerY - 1] != 0 && grid[attackerX - 1][attackerY - 1].infectStatus == false) {
      defenderList.push(grid[attackerX - 1][attackerY - 1]);
      infect(attackerList[i], defenderList[defenderList.length - 1]);
    }
    if (grid[attackerX - 1][attackerY] != 0 && grid[attackerX - 1][attackerY].infectStatus == false) {
      defenderList.push(grid[attackerX - 1][attackerY]);
      infect(attackerList[i], defenderList[defenderList.length - 1]);
    }
    if (grid[attackerX - 1][attackerY + 1] != 0 && grid[attackerX - 1][attackerY + 1].infectStatus == false) {
      defenderList.push(grid[attackerX - 1][attackerY + 1]);
      infect(attackerList[i], defenderList[defenderList.length - 1]);
    }
    if (grid[attackerX][attackerY - 1] != 0 && grid[attackerX][attackerY - 1].infectStatus == false) {
      defenderList.push(grid[attackerX][attackerY - 1]);
      infect(attackerList[i], defenderList[defenderList.length - 1]);
    }
    if (grid[attackerX][attackerY + 1] != 0 && grid[attackerX][attackerY + 1].infectStatus == false) {
      defenderList.push(grid[attackerX][attackerY + 1]);
      infect(attackerList[i], defenderList[defenderList.length - 1]);
    }
    if (grid[attackerX + 1][attackerY - 1] != 0 && grid[attackerX + 1][attackerY - 1].infectStatus == false) {
      defenderList.push(grid[attackerX + 1][attackerY - 1]);
      infect(attackerList[i], defenderList[defenderList.length - 1]);
    }
    if (grid[attackerX + 1][attackerY] != 0 && grid[attackerX + 1][attackerY].infectStatus == false) {
      defenderList.push(grid[attackerX + 1][attackerY]);
      infect(attackerList[i], defenderList[defenderList.length - 1]);
    }
    if (grid[attackerX + 1][attackerY + 1] != 0 && grid[attackerX + 1][attackerY + 1].infectStatus == false) {
      defenderList.push(grid[attackerX + 1][attackerY + 1]);
      infect(attackerList[i], defenderList[defenderList.length - 1]);
    }
  }
}

function infect(attacker, defender) {
  var infect = Math.floor(Math.random() * attacker.transmission + defender.protection);
  if (infect <= attacker.transmission) {
    defender.infectPerson();
  }
}
