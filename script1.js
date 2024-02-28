// Original script.js file
// Caused an error when desiring to run 'Start Outbreak' for an unknown reason
// Merged changes to calculate R (Anna's work) and my changes (Rena's work) to create a new script.js file
//    Checked by outputting R on local computer
// Kept in case I have inaccurately reflected changes

// Desc : Person class
class Person {
  // Desc : constructor
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

  // Desc : setter method updating this.xCoordinate and this.yCoordinate
  setGridPosition(xCoordinate, yCoordinate) {
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
  }

  // Desc : updates stats that have to do with being infected
  infectPerson() {
    this.infectStatus = true;
    this.transmission += simulation.disease.transmissionFactor;
  }

  // Desc : increments how long the person has been infected
  sickDay() {
    this.timeInfect++;
  }

  // Desc : updates stats to show immunity
  immune() {
    this.immuneStatus = true;
    this.infectStatus = false;
  }
}

// Desc : Disease class
class Disease {
  // Desc : constructor
  constructor(transmissionFactor, vaccineEfficacy, daysToSymptoms, daysToImmune) {
    this.transmissionFactor = transmissionFactor;
    this.vaccineEfficacy = vaccineEfficacy;
    this.daysToSymptoms = daysToSymptoms;
    this.daysToImmune = daysToImmune;
  }
}
const diseaseDictionary = {
  "leastInfectious": new Disease(20, 40, 2, 12),
    // Desc : covid inspired
  "mediumInfectious": new Disease(30, 30, 7, 14),
    // Desc : rubella inspired
  "mostInfectious": new Disease(40, 100, 4, 8)
    // Desc : measles inspired    
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

// Desc : Grid class
class Grid {
  // Desc : constructor
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
      // Reference : index.html, div element with id="grid"
    container.style.height = (this.gridHeight * 32) + 'px';
    container.style.width = (this.gridWidth * 32) + 'px';

    for (var x = 0; x < this.gridHeight; x++) for (var y = 0; y < this.gridWidth; y++) {
      var div = document.createElement("canvas");
        // Desc : created canvas element representing a cell of the grid
      var tempStr = `${x} + ${y}`;
        // Desc : id for the canvas element
      div.id = tempStr;
      div.height = 30;
      div.width = 30;
      container.appendChild(div);
        // Desc : the canvas element (div) is added to the grid (container)
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
      var randomX = getRNG(this.gridHeight);
      var randomY = getRNG(this.gridWidth);
      if (this.grid[randomX][randomY] == 0) {
        totalPopulation[i].setGridPosition(randomX, randomY);
        this.grid[randomX][randomY] = totalPopulation[i];
        i++;
      }
    }
  }

  // Desc : clears the board and updates gridHeight and gridWidth
  reset(height, width) {
    this.grid = [];
    this.gridHeight = height;
    this.gridWidth = width;
  }
}

// Desc : JSON of simulation variables
const simulation = {
  "days": [],
  "simulationLength": 31,
  "gridHeight": 15,
  "gridWidth": 15,
  "seed": "15x15",
  "patientZeroPosition": [7, 5],
  "populationSize": 100,
  "disease": diseaseDictionary.leastInfectious,
  "maskLevel": maskDictionary.mediumMask,
  "maskProtection": 20,
  "vaccLevel": vaccineDictionary.mediumVacc
}

let rng = new Math.seedrandom("15x15");
// Desc : implements the seeded random value
function getRNG(range) {
    return Math.floor(rng() * range);
}

// Desc : returns a list of randomly chosen people
function getRandomList(totalPopulation, length) {
  const listPeople = [];
  var i = 0;
  while (i < length) {
    const person = totalPopulation[getRNG(totalPopulation.length)];
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
    vaccPeople[i].protection += simulation.disease.vaccineEfficacy;
    vaccPeople[i].transmission -= simulation.disease.vaccineEfficacy;
  }
}

// Desc : makes two lists and gives them either masks or vaccines (or both)
function setPopulationStats() {
  const maskedPeople = getRandomList(totalPopulation, simulation.maskLevel);
  assignMasks(maskedPeople);
  const vaccPeople = getRandomList(totalPopulation, simulation.vaccLevel);
  assignVacc(vaccPeople);
}

// Desc : finds everyone who is currently infected, updates their sick/immune state, returns a list of everyone still currently infected
function updateInfected(totalPopulation) {
  const attackerList = [];
  for (var i = 0; i < totalPopulation.length; i++) {
    if (totalPopulation[i].infectStatus) {
      if (totalPopulation[i].timeInfect >= simulation.disease.daysToImmune) {
        totalPopulation[i].immune();
      } else {
        attackerList.push(totalPopulation[i]);
        totalPopulation[i].sickDay();
      }
    }
  }
  return attackerList;
}

// Desc : for everyone in the attacker list, it checks every surrounding contact and tries to infect them
function transmitDisease(attackerList, grid) {
  var numAttackers = 0
  var eachInfection = 0;
  for (var i = 0; i < attackerList.length; i++) {
      var attackerX = attackerList[i].xCoordinate;
      var attackerY = attackerList[i].yCoordinate;

      if (checkDefender(attackerX - 1, attackerY - 1)) {
          infect(attackerList[i], grid[attackerX - 1][attackerY - 1]);
          eachInfection++;
      }
      if (checkDefender(attackerX - 1, attackerY)) {
          infect(attackerList[i], grid[attackerX - 1][attackerY]);
          eachInfection++;
      }
      if (checkDefender(attackerX - 1, attackerY + 1)) {
          infect(attackerList[i], grid[attackerX - 1][attackerY + 1]);
        eachInfection++;
      }
      if (checkDefender(attackerX, attackerY - 1)) {
          infect(attackerList[i], grid[attackerX][attackerY + 1]);
        eachInfection++;
      }
      if (checkDefender(attackerX, attackerY + 1)) {
          infect(attackerList[i], grid[attackerX][attackerY + 1]);
        eachInfection++;
      }
      if (checkDefender(attackerX + 1, attackerY - 1)) {
          infect(attackerList[i], grid[attackerX + 1][attackerY - 1]);
        eachInfection++;

      }
      if (checkDefender(attackerX + 1, attackerY)) {
          infect(attackerList[i], grid[attackerX + 1][attackerY]);
        eachInfection++;

      }
      if (checkDefender(attackerX + 1, attackerY + 1)) {
          infect(attackerList[i], grid[attackerX + 1][attackerY + 1]);
        eachInfection++;
      }
      if (eachInfection > 0) {
        numAttackers++;
      }
  }
  var r = eachInfection / numAttackers;
  return r;
}

// Desc : checks to see if the given defender is in the bounds of the 2D array and if they fit the criteria of a defender
function checkDefender(x, y) {
  if ((x >= 0 && x < simulation.gridHeight) && (y >= 0 && y < simulation.gridWidth)) {
      if (town.grid[x][y] != 0 && town.grid[x][y].infectStatus == false  && town.grid[x][y].immuneStatus == false) {
          return true;
      }
  } else {
      return false;
  }
}

// Desc : uses a random number to see if the given attacker infects the given defender
function infect(attacker, defender) {
  var infect = getRNG(attacker.transmission + defender.protection);
  if (infect <= attacker.transmission) {
      defender.infectPerson();
  }
}

// Desc : declaring and initializing user input variables
var diseaseInput = document.getElementById("diseaseText");
var maskInput = document.getElementById("maskText");
var vaccInput = document.getElementById("vaccText");
var gridInput = document.getElementById("gridSlider");
var dayDisplay = document.getElementById("dayInfo");
var infectedDisplay = document.getElementById("infectedInfo");
var immuneDisplay = document.getElementById("immuneInfo");
var maxDayDisplay = document.getElementById("maxDayInfo");
var jsonInput = document.getElementById("jsonText");
jsonInput.value = JSON.stringify(simulation, null, " ");
var simButton = document.getElementById("runUserBtn");
var runButton = document.getElementById("rerunLabel");
runButton.style.display = "none";
var toggle = document.getElementById("toggle");
var config = document.getElementById("config");
config.style.display = "none";

// Desc : returns the mask level (refer to maskDictionary) according to maskRate
// Pre  : maskRate is the number inputed by the user
function getMaskLevel(maskRate) {
  if(maskRate == 0) {
    return maskDictionary.noMask;
  } else if(maskRate <= 25) {
    return maskDictionary.lowMask;
  } else if(maskRate <= 50) {
    return maskDictionary.mediumMask;
  } else if(maskRate <= 75) {
    return maskDictionary.highMask;
  } else {
    return maskDictionary.extremeMask;
  }
}

// Desc : returns the mask level (refer to vaccineDictionary) according to maskRate
// Pre  : maskRate is the number inputed by the user
function getVaccLevel(vaccRate) {
  if(vaccRate == 0) {
    return vaccineDictionary.noVacc;
  } else if(vaccRate <= 25) {
    return vaccineDictionary.lowVacc;
  } else if(vaccRate <= 50) {
    return vaccineDictionary.mediumVacc;
  } else if(vaccRate <= 75) {
    return vaccineDictionary.highVacc;
  } else {
    return vaccineDictionary.extremeVacc;
  }
}

// Desc : returns the infectiousness of the disease (refer to diseaseDictionary) according to disease
// Pre  : disease is the name of a disease inputed by the user
function getDiseaseLevel(disease) {
  if(disease == "Covid") {
    return diseaseDictionary.leastInfectious;
  } else if(disease == "Rubella") {
    return diseaseDictionary.mediumInfectious;
  } else if(disease == "Measles") {
    return diseaseDictionary.mostInfectious;
  }
}

// Desc : draws the grid according to dayGrid
// Pre  : dayInfo is the information of the simulation for a certain day
function display(dayInfo) {
  var dayGrid = dayInfo.grid;
  for (var i = 0; i < dayGrid.length; i++) {
    for (var j = 0; j < dayGrid[i].length; j++) {
      // Desc : accessing canvas element
      var tempStr = `${i} + ${j}`;
      var canvas = document.getElementById(tempStr);
      var context = canvas.getContext("2d");
      if (dayGrid[i][j] === 0) {   // Desc : clearing canvas element
        context.clearRect(0, 0, context.height, context.width)
        continue;
      }

      // Desc : determining color of circle
      if (dayGrid[i][j].immuneStatus) {
        context.fillStyle = "green";
      } else if (dayGrid[i][j].infectStatus && dayGrid[i][j].timeInfect >= simulation.disease.daysToSymptoms) {
        context.fillStyle = "#f0f000";
      } else if (dayGrid[i][j].infectStatus) {
        context.fillStyle = "red"; 
      } else {
        context.fillStyle = "blue";
      }
      // Desc : drawing circle
      context.beginPath();
      context.arc(15, 15, 12, 0, 2 * Math.PI);
      context.fill();
    }
  }

  dayDisplay.innerHTML = `Day ${day}`;
  infectedDisplay.innerHTML = `Infected: ${dayInfo.prevalence}`;
  immuneDisplay.innerHTML = `Immune: ${dayInfo.resistant}`;
}

// Desc : deletes the current cavas elements in the grid
function emptyGrid() {
  var container = document.getElementById("grid");
    //Reference : index.html, div element with id="grid"
  while (container.hasChildNodes()) {   // Desc : while loop that empties out the grid of canvas element cells
    container.removeChild(container.firstChild);
  }
}

// Desc : runs the simulation
function simulate() {
  rng = new Math.seedrandom("15x15");

  // Desc : resetting town (instance of grid) and other simulation data variables
  town.reset(simulation.gridHeight, simulation.gridWidth);
  town.build();
  town.setPatientZero(totalPopulation, simulation.disease);
  town.setPopulation(totalPopulation);
  setPopulationStats();
  day = 1;
  day1Data.grid = JSON.parse(JSON.stringify(town.grid));
  display(day1Data);
  simulation.days[0] = day1Data;

  // Desc : while loop to update and store simulation data
  while (day < simulation.simulationLength) {
    const attackerList = updateInfected(totalPopulation);
    var r = transmitDisease(attackerList, town.grid);
    if (r < 0 || isNaN(r)) {
      r = 0;
    }
    // Desc : calculates simulation data (total infected, total immune
    var totalInfected = 0;
    var totalImmune = 0;
    for (var i = 0; i < totalPopulation.length; i++) {
        if (totalPopulation[i].infectStatus) {
            totalInfected++;
        } else if (totalPopulation[i].immuneStatus) {
            totalImmune++;
        }
    }
    var difference = totalInfected - simulation.days[day-1].prevalence;
    if(difference < 0) {
      difference = 0;
    }
    
    // Desc : stores simulation data
    simulation.days[day] = {
      day: day+1,
      grid: JSON.parse(JSON.stringify(town.grid)),
      uninfected: (100 - totalInfected - totalImmune),
      prevalence: totalInfected,
      incidence: difference,
      resistant: totalImmune,
      r: r
    };
    day++;

    // Desc : while loop break condition
    if (totalInfected == 0) {
      break;
    } else if ((totalInfected + totalImmune) == totalPopulation.length) {
      break;
    }
  }

  // Desc : updating variables to prepare for user interaction
  day = 1;
  dayReached = day;
  maxDay = simulation.days.length;
  maxDayDisplay.innerHTML = `The simulation continues until Day ${maxDay}.`;
}

//Desc : creates a line graph according to data
//Pre  : data is an array of objects
function graph(data) {
  var dataReady = allGroup.map( function(group) {   //Desc : formats data
    return {
      name: group,
      values: data.map(function(d) {
        return {date: d.day, value: d[group]};
      })
    }
  })
  //console.log(dataReady);
  var svg = d3.select("#data")   //Desc : appending svg object to the #data div
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var x = d3.scaleLinear()   //Desc : adding the x axis
    .domain([ 0, 31 ])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
  svg.append("text")
    .attr("class", "x label")
    .style("text-anchor", "middle")
    .attr("x", width / 2 )
    .attr("y",  height + margin.top + 15)
    .text("Days");
  var y = d3.scaleLinear()   //Desc : adding the y axis
    .domain( [ 0, 100 ])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));
  svg.append("text")
    .attr("class", "y label")
    .style("text-anchor", "middle")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .text("Percentage");

  var line = d3.line()   //Desc : adding the lines
    .x(function(d) { return x(d.date) })
    .y(function(d) { return y(d.value) })
    .curve(d3.curveBasis);
  svg.selectAll("myLines")
    .data(dataReady)
    .enter()
    .append("path")
      .attr("class", function(d){ return d.name })
      .attr("d", function(d) { return line(d.values) })
      .attr("stroke", function(d) { return myColor(d.name) })
      .style("stroke-width", 2)
      .style("fill", "none");
  svg   //Desc: adding the points
    .selectAll("myDots")   //(1) enter in a group
    .data(dataReady)
    .enter()
      .append("g")
      .style("fill", function(d) { return myColor(d.name) })
      .attr("class", function(d) { return d.name })
    .selectAll("myPoints")   //(2) Enter in the 'values' part of the group
    .data(function(d) { return d.values })
    .enter()
  svg.selectAll("myLegend")   //Desc : adding an interactive legend
    .data(dataReady)
    .enter()
      .append("g")
      .append("text")
        .attr("x", function(d, i) { return 30 + (i * 100) })
        .attr("y", -5)
        .text(function(d) { return d.name; })
        .style("fill", function(d) { return myColor(d.name) })
        .style("font-size", 15)
      .on("click", function(d) {
        var currentOpacity = d3.selectAll("." + d.name).style("opacity");
          // Desc : visibilty of the element
        d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1);
      });
}

// Desc : deletes the current canvas elements in the grid, updates json (simulation) variables according to user input,
//        resets attributes of the people in totalPopulation, and rebuilds a grid according to the new values
function runUserSim() {
  emptyGrid();

  // Desc : reflecting form input (index.html, div element with id="form") into simulation JSON and resetting unlisted variables
  simulation.days = [];
  simulation.simulationLength = 31;
  simulation.gridHeight = gridInput.value;
  simulation.gridWidth = gridInput.value;
  simulation.seed = "15x15";
  simulation.patientZeroPosition = [7, 5];
  simulation.disease = getDiseaseLevel(diseaseInput.value);
  simulation.maskLevel = getMaskLevel(maskInput.value);
  simulation.maskProtection = 20;
  simulation.vaccLevel = vaccInput.value;
  jsonInput.value = JSON.stringify(simulation, null, " ");

  // Desc : resetting attribute values of people in totalPopulation
  for (var i = 0; i < simulation.populationSize; i++) {
    totalPopulation[i].transmission = 50;
    totalPopulation[i].protection = 50;
    totalPopulation[i].mask = false;
    totalPopulation[i].vaccine = false;
    totalPopulation[i].infectStatus = false;
    totalPopulation[i].timeInfect = 0;
    totalPopulation[i].immuneStatus = false;
  }

  simulate();
  d3.select("svg").remove(); // Desc : clearing previous graph
  graph(simulation.days.slice(0, day));
}

// Desc : deletes the current canvas elements in the grid, updates json (simulation) variables according to the json
//        configuration, resets attributes of the people in totalPopulation, and rebuilds a grid according to the new values
function runConfigSim() {
  emptyGrid();

  // Desc : reflecting configuration values onto simulation JSON
  simulation.days = [];
  var tempSim = JSON.parse(jsonInput.value);
  simulation.simulationLength = tempSim.simulationLength;
  simulation.gridHeight = tempSim.gridHeight;
  simulation.gridWidth = tempSim.gridWidth;
  simulation.seed = tempSim.seed;
  simulation.patientZeroPosition = tempSim.patientZeroPosition;
  simulation.disease = tempSim.disease;
  simulation.maskLevel = tempSim.maskLevel;
  simulation.maskProtection = tempSim.maskProtection;
  simulation.vaccLevel = tempSim.vaccLevel;
  jsonInput.value = JSON.stringify(simulation, null, " ");

  // Desc : resetting attribute values of people in totalPopulation
  for (var i = 0; i < simulation.populationSize; i++) {
    totalPopulation[i].transmission = 50;
    totalPopulation[i].protection = 50;
    totalPopulation[i].mask = false;
    totalPopulation[i].vaccine = false;
    totalPopulation[i].infectStatus = false;
    totalPopulation[i].timeInfect = 0;
    totalPopulation[i].immuneStatus = false;
  }
  
  simulate();
  d3.select("svg").remove(); // Desc : clearing previous graph
  graph(simulation.days.slice(0, day));
}

// Desc : decrements day and draws the grid of the corresponding day
function subtractDay() {
  if(day <= 1) {   // Desc : validating day
    return;
  }
  day--;
  display(simulation.days[day-1]);
}

// Desc : increments day and draws the grid of the corresponding day
function addDay() {
  if(day == (maxDay-1)) {   // Desc : validating day
    if(!play) {
      play = true;
    }
    playSim();
  } else if (day >= maxDay) {
    return;
  }
  day++;
  display(simulation.days[day-1]);

  if(dayReached < day) {   // Desc : updating dayReached
    dayReached = day;
  }
  if(dayReached < simulation.days.length) {
    d3.select("svg").remove();   // Desc : clearing previous graph
    graph(simulation.days.slice(0, dayReached));
  }
}

// Desc : adds a play/pause feature to the simulation
function playSim() {
  if(!run) {
    runButton.style.display = "block";
    runUserSim();
    run = true;
  }
  if(play) {
    play = false;
    clearInterval(autoRun); // stops automatic progression
    simButton.innerHTML = `Start Outbreak`;
  } else {
    play = true;
    if(day >= simulation.days.length) {
      day = 0;
    }
    autoRun = window.setInterval(addDay, 250); // starts automatic progression
    simButton.innerHTML = `Pause Outbreak`;
  }
}

// Desc : start another simulation
function reRun() {
  if (runButton.style.display == "block") {
    runButton.style.display = "none";
    run = false;
    playSim();
  }
}

// Desc : show/hide the advanced options box
function showOptions() {
  if(config.style.display == "none") {
    toggle.innerHTML = `Hide Advanced Options`;
    config.style.display = "block";
  } else {
    toggle.innerHTML = `Show Advanced Options`;
    config.style.display = "none";
  }
}

// Desc : declares and initializes the list of people 
var totalPopulation = [];
for (var i = 0; i < simulation.populationSize; i++) {
  totalPopulation.push(new Person(i));
}

// Desc : declaring and initializing variables needed for the simulation
const town = new Grid(simulation.gridHeight, simulation.gridWidth);
var day = 1;
var dayReached = day;
var day1Data = {
  day: 1,
  grid: JSON.parse(JSON.stringify(town.grid)),
  uninfected: 100,
  prevalence: 1,
  incidence: 0, 
  resistant: 0,
  r: 0
};
var run = false;
var play = false;
var autoRun;   // Desc : automatic progression method holder

//Desc : declaring variables needed for the graph
var margin = {top: 20, right: 30, bottom: 50, left: 50},   // Desc : style (height, width, margin) variables
  width = 600 - margin.left - margin.right,
  height = 350 - margin.top - margin.bottom;

var allGroup = ["prevalence", "incidence", "resistant"];   // Desc : multilinear names and colors
var myColor = d3.scaleOrdinal()
  .domain(allGroup)
  .range(["orange", "red", "green"]);
