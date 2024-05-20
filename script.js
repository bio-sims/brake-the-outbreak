//Epidemiology Simulation Project: Rena Ahn and Anna Muller
//Merged with Epidemiology.js [last update: 5/20/2024]
//   Improvement Goals...
//   (1) Favorable hardcoded values (vaccineEfficicacy, maskProtection, ...) for desired simulation data

// Desc : Person class
class Person {
  // Desc : constructor
  constructor() {
    this.transmission = 0;
    this.protection = 0;
    this.mask = false;
    this.vaccine = false;
    this.character = "";
    this.infectStatus = false;
    this.timeInfect = 0;
    this.immuneStatus = false;
    this.xCoordinate = 0;
    this.yCoordinate = 0;
    this.r = 0;
  }

  // Desc : setter method updating this.xCoordinate and this.yCoordinate
  setGridPosition(xCoordinate, yCoordinate) {
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
  }

  // Desc : setter method for updating the represented character for each person depending on their mask/vaccine assignment
  setCharacter() {
    if (this.mask && this.vaccine) {
      this.character = "B";
    } else if (!this.mask && this.vaccine) {
      this.character = "V";
    } else if (this.mask && !this.vaccine) {
      this.character = "M";
    } else {
      this.character = "";
    }
  }

  addMask() {
    this.mask = true;
    this.protection += simulation.maskProtection;
    if (this.protection > 100) {
      this.protection = 100;
    }
    this.transmission -= simulation.maskProtection;
    if (this.transmission < 0) {
      this.transmission = 0;
    }
  }

  addVaccine() {
    this.vaccine = true;
    this.protection += simulation.disease.vaccineEfficacy;
    if (this.protection > 100) {
      this.protection = 100;
    }
  }
  // Desc : updates stats that have to do with being infected
  infectPerson() {
    this.infectStatus = true;
    this.transmission += simulation.disease.transmissionFactor;
    if (this.transmission > 100) {
      this.transmission = 100;
    }    
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

  reset() {
    this.transmission = 0;
    this.protection = 0;
    this.mask = false;
    this.vaccine = false;
    this.infectStatus = false;
    this.timeInfect = 0;
    this.immuneStatus = false;
    this.r = 0;
    this.character = "";
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
  "leastInfectious": new Disease(20, 100, 2, 12),
  // Desc : covid inspired
  "mediumInfectious": new Disease(30, 100, 7, 14),
  // Desc : rubella inspired
  "mostInfectious": new Disease(40, 100, 4, 8)
  // Desc : measles inspired
}

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
    for (let i = 0; i < this.gridHeight; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.gridWidth; j++) {
        this.grid[i][j] = 0;
      }
    }

    var container = document.getElementById("grid");
    // Reference : index.html, div element with id="grid"
    container.style.height = (this.gridHeight * 32) + 'px';
    container.style.width = (this.gridWidth * 32) + 'px';

    for (let x = 0; x < this.gridHeight; x++) for (let y = 0; y < this.gridWidth; y++) {
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
    if (simulation.vaccLevel < simulation.populationSize) {
      patientZero.infectPerson(disease);
    }
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
      if (this.grid[randomX][randomY] === 0) {
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
  "gridHeight": 10,
  "gridWidth": 10,
  "seed": "5x5",
  "speedLevel": 3,
  "patientZeroPosition": [7, 5],
  "populationSize": 100,
  "disease": diseaseDictionary.mostInfectious,
  "maskLevel": 0,
  "maskProtection": 40,
  "vaccLevel": 0
}

// Desc : implements the seeded random value
var rng = new Math.seedrandom("15x15");
function getRNG(range) {
  return Math.floor(rng() * range);
}

// Desc : returns a list of randomly chosen people
function getMaskList(totalPopulation, length) {
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

function getVaccList(totalPopulation, length) {
  const listPeople = [];
  var i = 0;
  while (i < length) {
    let person = null;
    if (length < 100) {
      let rng = getRNG(totalPopulation.length)
      while (rng === 0) {
        rng = getRNG(totalPopulation.length)
      }
      person = totalPopulation[rng];
    } else {
      person = totalPopulation[getRNG(totalPopulation.length)];
    }
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
    maskedPeople[i].addMask();
  }
}

// Desc : changes stats of the given list and gives them vaccines
function assignVacc(vaccPeople) {
  for (var i = 0; i < vaccPeople.length; i++) {
    vaccPeople[i].addVaccine();
  }
}

// Desc : makes two lists and gives them either masks or vaccines (or both)
function setPopulationStats() {
  const maskedPeople = getMaskList(totalPopulation, simulation.maskLevel);
  assignMasks(maskedPeople);
  const vaccPeople = getVaccList(totalPopulation, simulation.vaccLevel);
  assignVacc(vaccPeople);
  for (let i = 0; i < totalPopulation.length; i++) {
    totalPopulation[i].setCharacter();
  }
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
  var numAttackers = 0;
  var totalInfections = 0;
  for (let i = 0; i < attackerList.length; i++) {
    var eachInfection = 0;
    var attackerX = attackerList[i].xCoordinate;
    var attackerY = attackerList[i].yCoordinate;

    if (checkDefender(attackerX - 1, attackerY - 1)) {
      if (infect(attackerList[i], grid[attackerX - 1][attackerY - 1])) {
        eachInfection++;
        attackerList[i].r++;
      }
    }
    if (checkDefender(attackerX - 1, attackerY)) {
      if (infect(attackerList[i], grid[attackerX - 1][attackerY])) {
        eachInfection++;
        attackerList[i].r++;
      }
    }
    if (checkDefender(attackerX - 1, attackerY + 1)) {
      if (infect(attackerList[i], grid[attackerX - 1][attackerY + 1])) {
        eachInfection++;
        attackerList[i].r++;
      }
    }
    if (checkDefender(attackerX, attackerY - 1)) {
      if (infect(attackerList[i], grid[attackerX][attackerY + 1])) {
        eachInfection++;
        attackerList[i].r++;
      }
    }
    if (checkDefender(attackerX, attackerY + 1)) {
      if (infect(attackerList[i], grid[attackerX][attackerY + 1])) {
        eachInfection++;
        attackerList[i].r++;
      }
    }
    if (checkDefender(attackerX + 1, attackerY - 1)) {
      if (infect(attackerList[i], grid[attackerX + 1][attackerY - 1])) {
        eachInfection++;
        attackerList[i].r++;
      }
    }
    if (checkDefender(attackerX + 1, attackerY)) {
      if (infect(attackerList[i], grid[attackerX + 1][attackerY])) {
        eachInfection++;
        attackerList[i].r++;
      }
    }
    if (checkDefender(attackerX + 1, attackerY + 1)) {
      if (infect(attackerList[i], grid[attackerX + 1][attackerY + 1])) {
        eachInfection++;
        attackerList[i].r++;
      }
    }
    if (eachInfection > 0) {
      totalInfections += eachInfection;
      numAttackers++;
    }
  }
  return eachInfection / numAttackers;
}

// Desc : checks to see if the given defender is in the bounds of the 2D array and if they fit the criteria of a defender
function checkDefender(x, y) {
  var isPerson = false;
  if ((x >= 0 && x < simulation.gridHeight) && (y >= 0 && y < simulation.gridWidth)) {
    if (typeof town.grid[x][y] !== 'undefined' && town.grid[x][y].infectStatus === false  && town.grid[x][y].immuneStatus === false) {
      isPerson = true;
    }
  } 
  return isPerson;
}

// Desc : uses a random number to see if the given attacker infects the given defender
function infect(attacker, defender) {
  if (typeof defender === 'undefined' || typeof defender === 'number') {
    return false;
  }
  var defendSuccess, attackSuccess;
  if (getRNG(100) <= attacker.transmission) {
    attackSuccess = true;
  }
  if (getRNG(100) <= defender.protection) {
    defendSuccess = true;
  }
  if (!defendSuccess && attackSuccess) {
    defender.infectPerson();
    /*defender.infectStatus = true;
    defender.transmission += simulation.disease.transmissionFactor;
    if (defender.transmission > 100) {
      defender.transmission = 100;
    }*/
    return true;
  } else {
    return false;
  }
}

// Desc : declaring / initializing user input variables
var diseaseInput = document.getElementById("diseaseText");
var maskInput = document.getElementById("maskText");
var vaccInput = document.getElementById("vaccText");
var gridInput = document.getElementById("gridText");
var seedInput = document.getElementById("seedText");
var speedInput = document.getElementById("speedSlider");
var dayDisplay = document.getElementById("dayInfo");
var infectedDisplay = document.getElementById("infectedInfo");
var immuneDisplay = document.getElementById("immuneInfo");
var jsonInput = document.getElementById("jsonText");
jsonInput.value = JSON.stringify(simulation, null, " ");

var playButton = document.getElementById("playBtn");
var runButton = document.getElementById("runBtn");
playButton.style.display = "none";

var toggle = document.getElementById("toggle");
var config = document.getElementById("config");
config.style.display = "none";

var finalR = document.getElementById("totalR");
var peakPrevalence = document.getElementById("peakPrevalence");
var lastDayIncidence = document.getElementById("lastIncidenceDay");
var outSummary = document.getElementById("finalSummaryReport");
outSummary.style.display = "none";

// Desc : returns the infectiousness of the disease (refer to diseaseDictionary) according to disease
// Pre  : disease is the name of a disease inputed by the user
function getDiseaseLevel(disease) {
  if(disease === "Covid") {
    return diseaseDictionary.mediumInfectious;
  } else if(disease === "Rubella") {
    return diseaseDictionary.leastInfectious;
  } else if(disease === "Measles") {
    return diseaseDictionary.mostInfectious;
  }
}

// Desc : returns the speed of automatic progression according to level
// Pre : level is between 1 and 5 inclusive
function getSpeed(level) {
  if(level == 1) {
    return 700;
  }
  if(level == 2) {
    return 550;
  }
  if(level == 3) {
    return 400;
  }
  if(level == 2) {
    return 250;
  }
  return 100;
}

// Desc : draws the grid according to dayGrid
// Pre  : dayInfo is the information of the simulation for a certain day
function display(dayInfo) {
  var dayGrid = dayInfo.grid;
  for (let i = 0; i < dayGrid.length; i++) {
    for (let j = 0; j < dayGrid[i].length; j++) {
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
        context.fillStyle = "#ffd800";
      } else if (dayGrid[i][j].infectStatus) {
        context.fillStyle = "red";
      } else {
        context.fillStyle = "blue";
      }
      // Desc : drawing circle
      context.beginPath();
      context.arc(15, 15, 12, 0, 2 * Math.PI);
      context.fill();

      // Desc : text labels
      context.font = "bold 20 pt Ariel";
      context.fillStyle = "white";
      context.textAlign = "center";
      context.fillText(dayGrid[i][j].character, 15, 19);
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

// Desc : iterates through the whole population list and resets each value to default
function resetTotalPopulation() {
  for (let i = 0; i < simulation.populationSize; i++) {
    totalPopulation[i].reset();
  }
}

// Desc : runs the simulation
function simulate() {
  // Desc : resetting town (instance of grid) and other simulation variables
  rng = new Math.seedrandom(simulation.seed);
  town.reset(simulation.gridHeight, simulation.gridWidth);
  town.build();
  town.setPatientZero(totalPopulation, simulation.disease);
  town.setPopulation(totalPopulation);
  setPopulationStats();
  day = 1;
  day1Data.grid = JSON.parse(JSON.stringify(town.grid));
  display(day1Data);
  simulation.days[0] = day1Data;

  let finalMaxPrevalence = 0;
  let finalMaxPrevalenceDay = 0;
  let finalLastIncidenceDay = 0;
  let finalMaxR = 0;

  // Desc : while loop to update and store simulation data
  while (day < simulation.simulationLength) {
    const attackerList = updateInfected(totalPopulation);
    var r = transmitDisease(attackerList, town.grid);
    if(r < 0 || isNaN(r)) {
      r = 0;
    }

    // Desc : calculates simulation data (total infected, total immune
    var totalInfected = 0;
    var totalImmune = 0;
    for (let i = 0; i < totalPopulation.length; i++) {
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

    if (difference > 0) {
      finalLastIncidenceDay = day + 1;
    }
    if (totalInfected > finalMaxPrevalence) {
      finalMaxPrevalence = totalInfected;
      finalMaxPrevalenceDay = day;
    }

    if (r > finalMaxR) {
      finalMaxR = r;
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
  }

  /* Code to calculate the average R throughout the whole simulation
  var calculateR = 0;
  var allInfected = 0;
  for (let i = 0; i < simulation.populationSize; i++) {
    if (totalPopulation[i].infectStatus === true || totalPopulation[i].immuneStatus === true) {
      allInfected++;
    }
    calculateR += totalPopulation[i].r;

  }
  calculateR = (calculateR / allInfected).toFixed(4);*/
  finalR.innerHTML = `Peak R: ${finalMaxR}`;
  peakPrevalence.innerHTML = `Peak Prevalence: ${finalMaxPrevalence} on day ${finalMaxPrevalenceDay+1}`;
  lastDayIncidence.innerHTML = `Day of last incident: ${finalLastIncidenceDay + 1}`;

  // Desc : updating variables to prepare for user interaction
  day = 1;
  dayReached = day;
}

//Desc : creates a line graph according to data
//Pre  : data is an array of objects
function graph(data) {
  var dataReady = allGroup.map( function(group) {   //Desc : formats data
    return {
      name: group.name,
      label: group.label,
      color: group.color,
      values: data.map(function(d) {
        return {date: d.day, value: d[group.name]};
      })
    }
  })
  var svg = d3.select("#data")   //Desc : appending svg object to the #data div
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var x = d3.scaleLinear()   //Desc : adding the x axis
    .domain([ 0, simulation.simulationLength ])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
  svg.append("text")
    .style("text-anchor", "middle")
    .attr("x", width / 2 )
    .attr("y",  height + margin.top)
    .text("Days");
  var y = d3.scaleLinear()   //Desc : adding the y axis
    .domain( [ 0, 100 ])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));
  svg.append("text")
    .style("text-anchor", "middle")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .text("Percentage");
  var line = d3.line()   // Desc : adding the lines
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
        .text(function(d) { return d.label; })
        .style("fill", function(d) { return myColor(d.name) })
        .style("font-size", 15)
      .on("click", function(d) {
        var currentOpacity = d3.selectAll("." + d.name).style("opacity");
          // Desc : visibilty of the element
        d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1);
      });
  svg.append("text")   // Desc : adding a title
    .attr("x", 0)             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px")
    .text("Graph A");

  var dataR = rGroup.map( function(group) {   //Desc : formats data
    return {
      name: group,
      values: data.map(function(d) {
        return {date: d.day, value: d[group]};
      })
    }
  })
  var svgR = d3.select("#rData")   //Desc : appending svg object to the #rData div
    .append("svg")
      .attr("width", widthR + marginR.left + marginR.right)
      .attr("height", heightR + marginR.top + marginR.bottom)
    .append("g")
      .attr("transform", "translate(" + marginR.left + "," + marginR.top + ")");
  var xR = d3.scaleLinear()   //Desc : adding the x axis
    .domain([ 0, 31 ])
    .range([ 0, widthR ]);
  svgR.append("g")
    .attr("transform", "translate(0," + heightR + ")")
    .call(d3.axisBottom(xR));
  svgR.append("text")
    .style("text-anchor", "middle")
    .attr("x", widthR / 2 )
    .attr("y",  heightR + marginR.top + 10)
    .text("Days");
  var yR = d3.scaleLinear()   //Desc : adding the y axis
    .domain( [ 0, 8 ])
    .range([ heightR, 0 ]);
  svgR.append("g")
    .call(d3.axisLeft(yR));
  svgR.append("text")
    .style("text-anchor", "middle")
    .attr("y", 0 - marginR.left + 5)
    .attr("x", 0 - (heightR / 2))
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .text("R");
  var lineR = d3.line()   // Desc : adding the lines
    .x(function(d) { return xR(d.date) })
    .y(function(d) { return yR(d.value) })
    .curve(d3.curveBasis);
  svgR.selectAll("myLines")
    .data(dataR)
    .enter()
    .append("path")
      .attr("d", function(d) { return lineR(d.values) })
      .attr("stroke", "purple")
      .style("stroke-width", 2)
      .style("fill", "none");
  svgR   //Desc: adding the points
    .selectAll("myDots")   //(1) enter in a group
    .data(dataR)
    .enter()
      .append("g")
      .style("fill", function(d) { return rColor(d.name) })
    .selectAll("myPoints")   //(2) Enter in the 'values' part of the group
    .data(function(d) { return d.values })
    .enter()
    .append("circle")
      .attr("class", "myCircle")
      .attr("cx", function(d) { return xR(d.date) } )
      .attr("cy", function(d) { return yR(d.value) } )
      .attr("r", 4)
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
  svgR.append("text")   // Desc : adding a title
    .attr("x", 0)             
    .attr("y", 0 - (marginR.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px")  
    .text("Graph B");
}

// Desc : deletes the current canvas elements in the grid, updates json (simulation) variables according to user input,
//        resets attributes of the people in totalPopulation, and rebuilds a grid according to the new values
function runSim() {
  emptyGrid();
  d3.select("#data svg").remove(); // Desc : clearing previous graph
  d3.select("#rData svg").remove();

  // Desc : ensuring values are updated
  updateValue();
  updateJSON();

  // Desc : resetting values
  simulation.days = [];
  resetTotalPopulation();
  simulate();
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
  if(day >= simulation.simulationLength) {   // Desc : validating day
    return;
  }

  day++;
  display(simulation.days[day-1]);
  if(dayReached < day) {   // Desc : updating dayReached
    dayReached = day;
  }
  
  d3.select("#data svg").remove();   // Desc : clearing previous graph
  d3.select("#rData svg").remove();
  graph(simulation.days.slice(0, dayReached));

  if(day === simulation.days.length) {
    playSim();
  }
  if(dayReached === simulation.days.length) {
    outSummary.style.display = "block";
  }
}

// Desc : adds a play/pause feature to the simulation
function playSim() {
  if(play) {
    play = false;
    clearInterval(autoRun); // stops automatic progression
    playButton.innerHTML = `Play Outbreak`;
  } else {
    play = true;
    if(day >= simulation.days.length) {
      day = 0;
    }
    autoRun = window.setInterval(addDay, getSpeed(simulation.speedLevel)); // starts automatic progression
    playButton.innerHTML = `Pause Outbreak`;
  }
}

// Desc : starts a new simulation
function startSim() {
  outSummary.style.display = "none";
  playButton.style.display = "block";
  runSim();
  if(play) {
    playSim();
  }
  playSim();
}

// Desc : updates simulation according to user input rates (mask rate and vaccine rate)
function updateRate() {
  if(simulation.maskLevel != maskInput.value) {
    if(maskInput.value > 100) {
      maskInput.value = 100;
    } else if(maskInput.value < 0) {
      maskInput.value = 0;
    }

    simulation.maskLevel = maskInput.value;
  }

  if(simulation.vaccLevel != vaccInput.value) {
    if(vaccInput.value > 100) {
      vaccInput.value = 100;
    } else if(vaccInput.value < 0) {
      vaccInput.value = 0;
    }

    simulation.vaccLevel = vaccInput.value;
  }

  // reflect onto JSON
  var tempSim = JSON.parse(JSON.stringify(simulation));
  tempSim.days = [];
  jsonInput.value = JSON.stringify(tempSim, null, " ");
}

// Desc : updates simulation according to user input values (not jsonInput)
function updateValue() {
  // update simulation
  if(simulation.disease !== getDiseaseLevel(diseaseInput.value)) {
    simulation.disease = getDiseaseLevel(diseaseInput.value);
  }
  if(simulation.gridHeight !== gridInput.value) {
    simulation.gridHeight = gridInput.value;
  }
  if(simulation.gridWidth !== gridInput.value) {
    simulation.gridWidth = gridInput.value;
  }
  if(simulation.seed !== seedInput.value) {
    simulation.seed = seedInput.value;
  }
  if(simulation.speedLevel != speedInput.value) {
    simulation.speedLevel = speedInput.value;
  }

  // reflect onto JSON
  var tempSim = JSON.parse(JSON.stringify(simulation));
  tempSim.days = [];
  jsonInput.value = JSON.stringify(tempSim, null, " ");
}

// Desc : validate input JSON for incorrect format and undefined values
function checkJSON() {
  // check for invalid json
  try {
    JSON.parse(jsonInput.value);
  } catch {
    jsonInput.value = JSON.stringify(simulation, null, " ");
    return;
  }
  // check for undefined values or wrong format (patientZeroPosition, disease)
  var invalid = false;
  var tempSim = JSON.parse(jsonInput.value);
  if(typeof tempSim.days == 'undefined' ||
     typeof tempSim.simulationLength == 'undefined' ||
     typeof tempSim.populationSize == 'undefined' ||
     typeof tempSim.gridHeight == 'undefined' ||
     typeof tempSim.gridWidth == 'undefined' ||
     typeof tempSim.seed == 'undefined' ||
     typeof tempSim.speedLevel == 'undefined' ||
     typeof tempSim.patientZeroPosition == 'undefined' ||
     typeof tempSim.disease == 'undefined' ||
     typeof tempSim.maskLevel == 'undefined' ||
     typeof tempSim.maskProtection == 'undefined' ||
     typeof tempSim.vaccLevel == 'undefined') {
    invalid = true;
  } else if(tempSim.patientZeroPosition.length !== 2) {
    invalid = true;
  } else if(typeof tempSim.disease.transmissionFactor == 'undefined' ||
            typeof tempSim.disease.vaccineEfficacy == 'undefined' ||
            typeof tempSim.disease.daysToSymptoms == 'undefined' ||
            typeof tempSim.disease.daysToImmune == 'undefined') {
    invalid = true;
  }

  if(invalid) {
    jsonInput.value = JSON.stringify(simulation, null, " ");
  }
}

// Desc : updates simulation according to jsonInput
function updateJSON() {
  checkJSON();
  // update JSON
  var tempSim = JSON.parse(jsonInput.value);
  if(tempSim.simulationLength < 0) {   // simulationLength
    simulation.simulationLength = 0;
  } else if(tempSim.simulationLength > 50) {
    simulation.simulationLength = 50;
  } else {
    simulation.simulationLength = tempSim.simulationLength;
  }
  if(tempSim.populationSize < 100) {   // populationSize
    simulation.populationSize = 100;
  } else if(tempSim.populationSize > 400) {
    simulation.populationSize = 400;
  } else {
    simulation.populationSize = tempSim.populationSize;
  }
  if(tempSim.gridHeight < 1) {   // gridHeight
    tempSim.gridHeight = 1;
  } else if(tempSim.gridHeight > 20) {
    tempSim.gridHeight = 20;
  }
  if(tempSim.gridWidth < 1) {   // gridWidth
    tempSim.gridWidth = 1;
  } else if(tempSim.gridWidth > 20) {
    tempSim.gridWidth = 20;
  }
  if(tempSim.gridHeight * tempSim.gridWidth >= simulation.populationSize) {   // gridHeight, gridWidth
    simulation.gridHeight = tempSim.gridHeight;
    simulation.gridWidth = tempSim.gridWidth;
  }
  simulation.seed = tempSim.seed;   // seed

  if(tempSim.speedLevel < 1) {   // speedLevel
    simulation.speedLevel = 1;
  } else if(tempSim.speedLevel > 5) {
    simulation.speedLevel = 5;
  } else {
    simulation.speedLevel = tempSim.speedLevel;
  }
  
  if(simulation.patientZeroPosition !== tempSim.patientZeroPosition) {   // patientZeroPosition
    var newY = tempSim.patientZeroPosition[0];
    var newX = tempSim.patientZeroPosition[1];
    if(newX < 0) {
      simulation.patientZeroPosition[1] = 0;
    } else if(newX >= simulation.gridWidth) {
      simulation.patientZeroPosition[1] = simulation.gridWidth - 1;
    } else {
      simulation.patientZeroPosition[1] = newX;
    }
    if(newY < 0) {
      simulation.patientZeroPosition[0] = 0;
    } else if(newY >= simulation.gridHeight) {
      simulation.patientZeroPosition[0] = simulation.gridHeight - 1;
    } else {
      simulation.patientZeroPosition[0] = newY;
    }
  }
  if(tempSim.disease.daysToSymptoms < 0) {   // disease
    tempSim.disease.daysToSymptoms = 0;
  }
  if(tempSim.disease.daysToImmune < 0) {
    tempSim.disease.daysToImmune = 0;
  }
  simulation.disease = tempSim.disease;
  if(tempSim.maskLevel < 0) {   // maskLevel
    simulation.maskLevel = 0;
  } else if(tempSim.maskLevel > 100) {
    simulation.maskLevel = 100;
  } else {
    simulation.maskLevel = tempSim.maskLevel;
  }
  simulation.maskProtection = tempSim.maskProtection;   // maskProtection
  if(tempSim.vaccLevel < 0) {   // vaccLevel
    simulation.vaccLevel = 0;
  } else if(tempSim.vaccLevel > 100) {
    simulation.vaccLevel = 100;
  } else {
    simulation.vaccLevel = tempSim.vaccLevel;
  }
  // display current simulation (some changes by the user are not reflected)
  tempSim = JSON.parse(JSON.stringify(simulation));
  tempSim.days = [];
  jsonInput.value = JSON.stringify(tempSim, null, " ");
}

// Desc : show/hide the advanced options box
function showOptions() {
  if(config.style.display === "none") {
    toggle.innerHTML = `Hide Advanced Options`;
    config.style.display = "block";
  } else {
    toggle.innerHTML = `Show Advanced Options`;
    config.style.display = "none";
  }
}

// Desc : declares and initializes the list of people
var totalPopulation = [];
for (let i = 0; i < simulation.populationSize; i++) {
  totalPopulation.push(new Person());
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
var play = false;
var autoRun;   // Desc : variable for automatic progression

//Desc : declaring variables needed for the graph
var margin = {top: 40, right: 50, bottom: 50, left: 50},   // Desc : style (height, width, margin) variables
  width = 650 - margin.left - margin.right,
  height = 390 - margin.top - margin.bottom;

var allGroup = [
  {
    name: "uninfected",
    label: "Uninfected"
  },
  { 
    name: "resistant",
    label: "Resistant"
  },
  {
    name: "incidence",
    label: "Incidence"
  },
  {
    name: "prevalence",
    label: "Prevalence (red+yellow)"
  }
];   // Desc : multilinear names, labels
var myColor = d3.scaleOrdinal()
  .domain(allGroup.map(function(d) { return d.name }))
  .range(["blue", "green", "red", "#FFA500"]);

var marginR = {top: 30, right: 30, bottom: 50, left: 50},
  widthR = 650 - marginR.left - marginR.right,
  heightR = 320 - marginR.top - marginR.bottom;

var rGroup = ["r"];
var rColor = d3.scaleOrdinal()
  .domain(rGroup)
  .range(["purple"]);

var Tooltip = d3.select("#value")   // Desc : creating a tooltip
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "5px");

//Desc : 3 functions that change Tooltip
var mouseover = function(d) {   // Desc : when the user hovers over a cell
  Tooltip
    .style("opacity", 1);
}
var mousemove = function(d) {   // Desc : when the user moves over a cell
  Tooltip
    .html("Exact R Value: " + d.value)
    .style("left", (d3.mouse(this)[0]+70) + "px")
    .style("bottom", (d3.mouse(this)[1]) + "px");
}
var mouseleave = function(d) {   // Desc : when the user leaves a cell
  Tooltip
    .style("opacity", 0);
}
