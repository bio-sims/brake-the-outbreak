// Anna Muller and Rena Ahn
// Epidemiology Simulation

// Dependency: npm install seedrandom
// Source: https://youtu.be/TM8X64R9MIc?si=8ZS42Z39J0qaRKoj&t=199
//         https://www.npmjs.com/package/seedrandom

import file from "./config.json" with { type: "json"};


const seedrandom = require('seedrandom');
const rng = seedrandom(12 /*this needs to be changeable*/);

// returns a random number from the above seed
function getRNG(range) {
    return Math.floor(rng() * range);
}


class Person {
    constructor() {
        this.transPercent = 50; // transmission percent
        this.protPercent = 50; // protection percent
        this.infectStatus = false; // infection status
        this.timeInfect = 0; // time infected
        this.immuneStatus = false; // immunity status (post-infection)
        this.display = "O"; // only for command line
        this.xCoordinate = 0; // row within 2D array
        this.yCoordinate = 0;// column within 2D array
    }
}

class Disease {
    constructor(name, rNot, vaccRate, vaccThreshold, daysToSx, daysToImmune) { 
        this.name = name;
        this.rNot = rNot; // 
        this.vaccRate = vaccRate; // how much of the total population got the vaccine rate
        this.vaccThreshold = vaccThreshold; // the herd immunity threshold that should prevent spread
        this.daysToSx = daysToSx; // how long after becoming infected the person will show symptoms
        this.daysToImmune = daysToImmune; //how many days after being infectious will the person no longer be contaminated
    }
}
const diseaseDictionary = {
    "rubella": new Disease("Rubella", 5, 90, 0.8, 7, 14),
    "sarsCoV2": new Disease("sarsCoV2", 2.5, 62, 0.6, 2, 12),
    "measles": new Disease("measles", 15, 95, 0.93, 4, 8)
}                   

class Mask {
    constructor(noMask, cloth, surgical, kn95) {
        this.noMask = noMask;
        this.cloth = cloth;
        this.surgical = surgical;
        this.kn95 = kn95;
    }
}
const maskDictionary = {
    "noMaskUsage": new Mask(1,0,0,0),
    "verylowMaskUsage": new Mask(0.9, 0, 0.5, 0.5),
    "lowMaskUsage": new Mask(0.6, 0.5, 0.33, 0.17),
    "mediumMaskUsage": new Mask(0.4, 0.5, 0.33, 0.17),
    "highMaskUsage": new Mask(0.25, 0.27, 0.33, 0.4),
    "veryHighMaskUsage": new Mask(0.1, 0.11, 0.33, 0.56)
};

class Vaccine {
    constructor() {
        this.noVacc = 0;
        this.lowVacc = 0.25;
        this.mediumVacc = 0.5;
        this.highVacc = 0.75;
        this.extremeVacc = 0.9;
    }
}

class Grid {
    constructor(gridHeight, gridWidth) {
        this.grid = [];
        this.gridHeight = gridHeight;
        this.gridWidth = gridWidth;
    }

    build() {
        for (var i = 0; i < this.gridHeight; i++) {
            this.grid[i] = [];
            for (var j = 0; j < this.gridWidth; j++) {
                this.grid[i][j] = "_";
            }
        }
    }

    hardCodePatientZero(totalPopulation){
        var patientZero = totalPopulation[0];
        patientZero.xCoordinate = 7;
        patientZero.yCoordinate = 5;
        patientZero.display = "x"
        this.grid[patientZero.xCoordinate][patientZero.yCoordinate] = patientZero;

        var adjPerson1 = totalPopulation[1];
        adjPerson1.xCoordinate = 6;
        adjPerson1.yCoordinate = 4;
        this.grid[adjPerson1.xCoordinate][adjPerson1.yCoordinate] = adjPerson1;
        
        var adjPerson2 = totalPopulation[2];
        adjPerson2.xCoordinate = 6;
        adjPerson2.yCoordinate = 5;
        this.grid[adjPerson2.xCoordinate][adjPerson2.yCoordinate] = adjPerson2;
        
        var adjPerson3 = totalPopulation[3];
        adjPerson3.xCoordinate = 6;
        adjPerson3.yCoordinate = 6;
        this.grid[adjPerson3.xCoordinate][adjPerson3.yCoordinate] = adjPerson3;
        
        var adjPerson4 = totalPopulation[4];
        adjPerson4.xCoordinate = 7;
        adjPerson4.yCoordinate = 4;
        this.grid[adjPerson4.xCoordinate][adjPerson4.yCoordinate] = adjPerson4;
        
        var adjPerson5 = totalPopulation[5];
        adjPerson5.xCoordinate = 7;
        adjPerson5.yCoordinate = 6;
        this.grid[adjPerson5.xCoordinate][adjPerson5.yCoordinate] = adjPerson5;
        
        var adjPerson6 = totalPopulation[6];
        adjPerson6.xCoordinate = 8;
        adjPerson6.yCoordinate = 4;
        this.grid[adjPerson6.xCoordinate][adjPerson6.yCoordinate] = adjPerson6;
        
        var adjPerson7 = totalPopulation[7];
        adjPerson7.xCoordinate = 8;
        adjPerson7.yCoordinate = 5;
        this.grid[adjPerson7.xCoordinate][adjPerson7.yCoordinate] = adjPerson7;
        
        var adjPerson8 = totalPopulation[8];
        adjPerson8.xCoordinate = 8;
        adjPerson8.yCoordinate = 6;
        this.grid[adjPerson8.xCoordinate][adjPerson8.yCoordinate] = adjPerson8;         
    }

    setPopulation(totalPopulation) {
        var i = 9; 
        while (i < totalPopulation.length) {
            var randomX = getRNG(gridHeight);
            var randomY = getRNG(gridWidth);
            if(this.grid[randomX][randomY] == "_") {
                totalPopulation[i].xCoordinate = randomX;
                totalPopulation[i].yCoordinate = randomY;
                this.grid[randomX][randomY] = totalPopulation[i];
                i++;
            }
        }
    }

    display() { // this is only for command line
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

// TODO: look up what a JSON file is
// {gridheight: , gridwidth: , mask percent: , vaccinepercent: , patient0position: }

// create the list of people before inserting them into the grid
const totalPopulation = [];
for (var i = 0; i < 100; i++) {
    totalPopulation.push(new Person());
}

// enter the size of the grid
var gridHeight = 12; // number of rows
var gridWidth = 12;  // number of columns

// create the grid with the people in it already
var grid = new Grid(gridHeight, gridWidth);
grid.build();
grid.hardCodePatientZero(totalPopulation);
grid.setPopulation(totalPopulation);
console.log(grid.display());
