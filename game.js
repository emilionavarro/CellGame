const CellGame = require('./classes/cellGame'); 
const TestCell = require('./cells/testCell');
const Group2 = require('./cells/group2');
const Config = require('./classes/Configuration');

//get custom cells
var customCells = [];
var cellTypes = {};

cellTypes["TestCell"] = TestCell;
cellTypes["Group2"] = Group2;

//create cell game with custom cells
var game = new CellGame(Config.GetBoardSize(), cellTypes);

game.Play();