// Anna Muller and Rena Ahn
// Epidemiology Simulation

// Dependencies: install Node.js (https://nodejs.org/en/download/current)
//             npm install seedrandom (in terminal)
// Source: https://youtu.be/TM8X64R9MIc?si=8ZS42Z39J0qaRKoj&t=199
//         https://www.npmjs.com/package/seedrandom

class Person {
    constructor(num) {
        this.num = num; // to keep track of people during testing/debugging, can delete
        this.transmission = 50; // the number for which the personcan transmit the disease when infected
        this.protection = 50; // the number depending on whether the person is wearing a mask or vaccinated
        this.mask = false; // shows if the person does have a mask, can delete
        this.vaccine = false; // shows ifthe person got vaccinated, can delete
        this.infectStatus = false; // shows if the person has been infected 
        this.timeInfect = 0; // shows how long the person has been infected, incubated and sick added up
        this.immuneStatus = false; // shows if the person has gone through being infected and are now immune to the disease
        this.xCoordinate = 0; // row position
        this.yCoordinate = 0; // column position
        this.display = "O"; // display command line only: O = not infected/not immune, i = incubated/asymptomatic, X = symptomatic, I = immune
    }

    // Desc : Setter method once the person is assigned a grid position
    setGridPosition(xCoordinate, yCoordinate) {
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
    }

    // Desc : updates stats that have to do with being infected
    infectPerson() {
        this.infectStatus = true;
        this.transmission += simulation.disease.rNot;
        this.display = "i";
    }

    // Desc : increments how long the person has been infected
    sickDay() {
        this.timeInfect++;
    }

    // Desc : updates stats to show immunity
    immune() {
        this.display = "I";
        this.immuneStatus = true;
        this.infectStatus = false;
    }
}

class Disease {
    constructor(rNot, vaccEff, daysToSx, daysToImmune) {
        this.rNot = rNot; // the rate people get infected with no protection
        this.vaccEff = vaccEff; // the effectiveness of the vaccine
        this.daysToSx = daysToSx; // how long it takes for the person to show symptoms
        this.daysToImmune = daysToImmune; // how long it takes for the person to be immune to the disease
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
    constructor(/*gridHeight, gridWidth*/) {
        this.grid = []; 
        this.gridHeight = simulation.gridHeight;
        this.gridWidth = simulation.gridWidth;
        this.build();
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
    setPatientZero(totalPopulation){
        var patientZero = totalPopulation[0];
        var pZeroX = simulation.patientZeroPosition[0];
        var pZeroY = simulation.patientZeroPosition[1];;
        patientZero.setGridPosition(pZeroX, pZeroY);
        patientZero.infectPerson(simulation.disease);
        this.grid[patientZero.xCoordinate][patientZero.yCoordinate] = patientZero;

        var adjPerson1 = totalPopulation[1];
        adjPerson1.setGridPosition(pZeroX - 1, pZeroY - 1);
        this.grid[adjPerson1.xCoordinate][adjPerson1.yCoordinate] = adjPerson1;
        
        var adjPerson2 = totalPopulation[2];
        adjPerson2.setGridPosition(pZeroX - 1, pZeroY);
        this.grid[adjPerson2.xCoordinate][adjPerson2.yCoordinate] = adjPerson2;
        
        var adjPerson3 = totalPopulation[3];
        adjPerson3.setGridPosition(pZeroX - 1, pZeroY + 1);
        this.grid[adjPerson3.xCoordinate][adjPerson3.yCoordinate] = adjPerson3;
        
        var adjPerson4 = totalPopulation[4];
        adjPerson4.setGridPosition(pZeroX, pZeroY - 1);
        this.grid[adjPerson4.xCoordinate][adjPerson4.yCoordinate] = adjPerson4;
        
        var adjPerson5 = totalPopulation[5];
        adjPerson5.setGridPosition(pZeroX, pZeroY + 1);
        this.grid[adjPerson5.xCoordinate][adjPerson5.yCoordinate] = adjPerson5;
        
        var adjPerson6 = totalPopulation[6];
        adjPerson6.setGridPosition(pZeroX + 1, pZeroY - 1);
        this.grid[adjPerson6.xCoordinate][adjPerson6.yCoordinate] = adjPerson6;
        
        var adjPerson7 = totalPopulation[7];
        adjPerson7.setGridPosition(pZeroX + 1, pZeroY);
        this.grid[adjPerson7.xCoordinate][adjPerson7.yCoordinate] = adjPerson7;
        
        var adjPerson8 = totalPopulation[8];
        adjPerson8.setGridPosition(pZeroX + 1, pZeroY + 1);
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
    "days": [], // to save each individual day, for if we had a way to manually scroll through each day
    "simulationLength": 31, // how many days the simulation will run
    "gridHeight": 12, // number of rows in the 2D array
    "gridWidth": 12, // number of columns in the 2D array
    "seed": "12x12", // the seed depends on the height x width
    "patientZeroPosition": [7, 5], // x- and y-coordinates for patient zero and the surrounding contacts
    "populationSize": 100, // the number of people in the simulation
    "disease": diseaseDictionary.mediumInfectious, // the chosen disease
    "maskLevel": maskDictionary.extremeMask, // the number of people wearing a mask
    "maskProtection": 10, // the protection rate a mask adds to the person
    "vaccLevel": vaccineDictionary.extremeVacc // the number of people getting vaccinated
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

// Desc : finds everyone who is currently infected, updates their sick/immune state, returns a list of everyone still currently infected
function updateInfected(totalPopulation) {
    const attackerList = [];
    for (var i = 0; i < totalPopulation.length; i++) {
        if (totalPopulation[i].infectStatus) {
            if (totalPopulation[i].timeInfect >= simulation.disease.daysToImmune) {
                totalPopulation[i].immune();
            } else {
                attackerList.push(totalPopulation[i]);
                if (totalPopulation[i].timeInfect == simulation.disease.daysToSx) {
                    totalPopulation[i].display = "X";
                }
                totalPopulation[i].sickDay();
            }
        }
    }
    return attackerList;
}

// Desc : for everyone in the attacker list, it checks every surrounding contact and tries to infect them
function transmitDisease(attackerList, grid) {
    for (var i = 0; i < attackerList.length; i++) {
        var attackerX = attackerList[i].xCoordinate;
        var attackerY = attackerList[i].yCoordinate;
    
        if (checkDefender(attackerX - 1, attackerY - 1)) {
            infect(attackerList[i], grid[attackerX - 1][attackerY - 1]);
        }
        if (checkDefender(attackerX - 1, attackerY)) {
            infect(attackerList[i], grid[attackerX - 1][attackerY]);
        }
        if (checkDefender(attackerX - 1, attackerY + 1)) {
            infect(attackerList[i], grid[attackerX - 1][attackerY + 1]);
        }
        if (checkDefender(attackerX, attackerY - 1)) {
            infect(attackerList[i], grid[attackerX][attackerY + 1]);
        }
        if (checkDefender(attackerX, attackerY + 1)) {
            infect(attackerList[i], grid[attackerX][attackerY + 1]);
        }
        if (checkDefender(attackerX + 1, attackerY - 1)) {
            infect(attackerList[i], grid[attackerX + 1][attackerY - 1]);
        }
        if (checkDefender(attackerX + 1, attackerY)) {
            infect(attackerList[i], grid[attackerX + 1][attackerY]);
        }
        if (checkDefender(attackerX + 1, attackerY + 1)) {
            infect(attackerList[i], grid[attackerX + 1][attackerY + 1]);
        }
    }    
}

// Desc : Checks to see if the given defender is in the bounds of the 2D array and if they fit the criteria of a defender
function checkDefender(x, y) {
    if ((x >= 0 && x < simulation.gridHeight) && (y >= 0 && y < simulation.gridWidth)) {
        if (town.grid[x][y] != "_" && town.grid[x][y].infectStatus == false  && town.grid[x][y].immuneStatus == false) {
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

// Desc : makes the list of people 
const totalPopulation = [];
for (var i = 0; i < simulation.populationSize; i++) {
    totalPopulation.push(new Person(i));
}

// Desc : builds the board before the simulation begins
const town = new Grid(simulation.gridHeight, simulation.gridWidth);
town.setPatientZero(totalPopulation, simulation.disease);
town.setPopulation(totalPopulation);
console.log(town.display());
setPopulationStats();
simulation.days.push(town.display());

var day = 1;
// ! while loop start
while (day <= simulation.simulationLength) {
    console.log("Day " + day);
    const attackerList = updateInfected(totalPopulation);
    transmitDisease(attackerList, town.grid);
    console.log(town.display()); 
    
    // calculates the total infected and total immune people, checks to see if the disease can move anywhere the next day
    var totalInfected = 0;
    var totalImmune = 0;
    for (var i = 0; i < totalPopulation.length; i++) {
        if (totalPopulation[i].infectStatus) {
            totalInfected++;
        } else if (totalPopulation[i].immuneStatus) {
            totalImmune++;
        }
    }
    simulation.days.push(town.display());
    console.log("Infected: " + totalInfected);
    console.log("Immune: " + totalImmune);
    console.log();
    if (totalInfected == 0) {
        console.log("No one is infected. Break");
        break;
    } else if ((totalInfected + totalImmune) == totalPopulation.length) {
        console.log("Everyone is or has been infected. Break");
        break;
    }

    day++;

}
// ! while loop end
