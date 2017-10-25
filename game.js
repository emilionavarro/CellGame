const CellGame = require('./classes/CellGame'); 
const TestCell = require('./cells/TestCell');
const Group2 = require('./cells/Group2');
const Point = require('./classes/Point');
const Helpers = require('./classes/Helpers');
const boardSize = 5;

//get custom cells
var customCells = [];
var cellTypes = {};

cellTypes["TestCell"] = TestCell;
cellTypes["Group2"] = Group2;

//create cell game with custom cells
var game = new CellGame(boardSize, cellTypes);

game.Play();