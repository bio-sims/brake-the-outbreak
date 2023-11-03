// Anna Muller and Rena Ahn
// Epidemiology Simulation

// Dependency: npm install seedrandom
// Source: https://youtu.be/TM8X64R9MIc?si=8ZS42Z39J0qaRKoj&t=199
//         https://www.npmjs.com/package/seedrandom

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
        this.display = "O";
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
        this.display = "i";
        this.timeInfect = 1;
    }
}

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
                this.grid[i][j] = "_";
            }
        }
    }
    // Desc : hardcodes Patient Zero and its surrouding 8 contacts according to the given patient zero position in Simulation
    setPatientZero(totalPopulation, disease){
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
            if(this.grid[randomX][randomY] == "_") {
                totalPopulation[i].setGridPosition(randomX, randomY);
                this.grid[randomX][randomY] = totalPopulation[i];
                i++;
            }
        }
    }
    
    // Desc : prints the board, only for command line
    display() { 
        var returnString = "";
        for (var i = 0; i < this.gridHeight; i++) {
            for (var j = 0; j < this.gridWidth; j++) {
                if (this.grid[i][j] == "_") {
                    returnString += this.grid[i][j];
                } else {
                    returnString += this.grid[i][j].display;
                }
                returnString += "  ";
            }
            returnString += "\n";
        }
        return returnString;
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

// Desc : This implements the seeded random value
const seedrandom = require('seedrandom');
const rng = seedrandom(simulation.seed);
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
function assignVacc(vaccPeople){
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
console.log(town.display());
setPopulationStats();

var day = 1;
while (day < simulation.simulationLength) {
    const attackerList = [];
    for (var i = 0; i < totalPopulation.length; i++) {
        if (totalPopulation[i].infectStatus == true) {
            attackerList.push(totalPopulation[i]);
        }
    }
    console.log(attackerList);
    const defenderList = [];
    for (var i = 0; i < attackerList.length; i++) {
        var attackerX = attackerList[i].xCoordinate;
        var attackerY = attackerList[i].yCoordinate;

        if (town.grid[attackerX - 1][attackerY - 1] != "_" && town.grid[attackerX - 1][attackerY - 1].infectStatus == false) {
            defenderList.push(town.grid[attackerX - 1][attackerY - 1]);
            infect(attackerList[i], defenderList[defenderList.length - 1]);
        }
        if (town.grid[attackerX - 1][attackerY] != "_" && town.grid[attackerX - 1][attackerY].infectStatus == false) {
            defenderList.push(town.grid[attackerX - 1][attackerY]);
            infect(attackerList[i], defenderList[defenderList.length - 1]);
        }
        if (town.grid[attackerX - 1][attackerY + 1] != "_" && town.grid[attackerX - 1][attackerY + 1].infectStatus == false) {
            defenderList.push(town.grid[attackerX - 1][attackerY + 1]);
            infect(attackerList[i], defenderList[defenderList.length - 1]);
        }
        if (town.grid[attackerX][attackerY - 1] != "_" && town.grid[attackerX][attackerY - 1].infectStatus == false) {
            defenderList.push(town.grid[attackerX][attackerY - 1]);
            infect(attackerList[i], defenderList[defenderList.length - 1]);
        }
        if (town.grid[attackerX][attackerY + 1] != "_" && town.grid[attackerX][attackerY + 1].infectStatus == false) {
            defenderList.push(town.grid[attackerX][attackerY + 1]);
            infect(attackerList[i], defenderList[defenderList.length - 1]);
        }
        if (town.grid[attackerX + 1][attackerY - 1] != "_" && town.grid[attackerX + 1][attackerY - 1].infectStatus == false) {
            defenderList.push(town.grid[attackerX + 1][attackerY - 1]);
            infect(attackerList[i], defenderList[defenderList.length - 1]);
        }
        if (town.grid[attackerX + 1][attackerY] != "_" && town.grid[attackerX + 1][attackerY].infectStatus == false) {
            defenderList.push(town.grid[attackerX + 1][attackerY]);
            infect(attackerList[i], defenderList[defenderList.length - 1]);
        }
        if (town.grid[attackerX + 1][attackerY + 1] != "_" && town.grid[attackerX + 1][attackerY + 1].infectStatus == false) {
            defenderList.push(town.grid[attackerX + 1][attackerY + 1]);
            infect(attackerList[i], defenderList[defenderList.length - 1]);
        }
    }
    console.log(town.display());
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
    
        if (grid[attackerX - 1][attackerY - 1] != "_" && grid[attackerX - 1][attackerY - 1].infectStatus == false) {
            defenderList.push(grid[attackerX - 1][attackerY - 1]);
            infect(attackerList[i], defenderList[defenderList.length - 1]);
        }
        if (grid[attackerX - 1][attackerY] != "_" && grid[attackerX - 1][attackerY].infectStatus == false) {
            defenderList.push(grid[attackerX - 1][attackerY]);
            infect(attackerList[i], defenderList[defenderList.length - 1]);
        }
        if (grid[attackerX - 1][attackerY + 1] != "_" && grid[attackerX - 1][attackerY + 1].infectStatus == false) {
            defenderList.push(grid[attackerX - 1][attackerY + 1]);
            infect(attackerList[i], defenderList[defenderList.length - 1]);
        }
        if (grid[attackerX][attackerY - 1] != "_" && grid[attackerX][attackerY - 1].infectStatus == false) {
            defenderList.push(grid[attackerX][attackerY - 1]);
            infect(attackerList[i], defenderList[defenderList.length - 1]);
        }
        if (grid[attackerX][attackerY + 1] != "_" && grid[attackerX][attackerY + 1].infectStatus == false) {
            defenderList.push(grid[attackerX][attackerY + 1]);
            infect(attackerList[i], defenderList[defenderList.length - 1]);
        }
        if (grid[attackerX + 1][attackerY - 1] != "_" && grid[attackerX + 1][attackerY - 1].infectStatus == false) {
            defenderList.push(grid[attackerX + 1][attackerY - 1]);
            infect(attackerList[i], defenderList[defenderList.length - 1]);
        }
        if (grid[attackerX + 1][attackerY] != "_" && grid[attackerX + 1][attackerY].infectStatus == false) {
            defenderList.push(grid[attackerX + 1][attackerY]);
            infect(attackerList[i], defenderList[defenderList.length - 1]);
        }
        if (grid[attackerX + 1][attackerY + 1] != "_" && grid[attackerX + 1][attackerY + 1].infectStatus == false) {
            defenderList.push(grid[attackerX + 1][attackerY + 1]);
            infect(attackerList[i], defenderList[defenderList.length - 1]);
        }
    }    
}

function infect(attacker, defender) {
    var infect = getRNG(attacker.transmission + defender.protection);
    //console.log(infect);
    if (infect <= attacker.transmission) {
        //console.log('infected');
        defender.infectPerson();
    }
}
//console.log(defenderList);
