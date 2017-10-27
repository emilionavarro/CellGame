const Point = require('./point');
const Cell = require('./cell');
const Helpers = require('./helpers');
const BoardSlot = require('./boardSlot');

class Board {
    constructor(size) {
        this.size = size;
        this._board = void 0;
        this.cells = [];
    }

    Update(changedBoard) {
        this._board = changedBoard._board;
        this.cells = this.cells.concat(changedBoard.cells);
    }

    Populate(cellTypes) {
        var addedCells = [],
        direction = void 0,
        position = void 0;

        direction = new Point(Helpers.GenerateStartMaxMovement(), Helpers.GenerateStartMaxMovement());
        position = new Point(0, Math.floor(this.size / 2));
        this.PlaceCell(new cellTypes["TestCell"](Helpers.GenerateStartMaxLife(), Helpers.GenerateStartMaxChildren(), direction, position, false), position);

        direction = new Point(Helpers.GenerateStartMaxMovement(), Helpers.GenerateStartMaxMovement());
        position = new Point(this.size - 1, Math.floor(this.size / 2));
        this.PlaceCell(new cellTypes["Group2"](Helpers.GenerateStartMaxLife(), Helpers.GenerateStartMaxChildren(), direction, position, false), position);
    }

    PlaceCell(cell, position) {
        this.MoveCell(cell, position);
        this.cells.push(cell);
    }

    MoveCell(cell, position) {
        cell.food += this._board[position.x][position.y].Harvest();
        this._board[position.x][position.y].value = cell;
    }

    Generate() {
        var tempBoard = [];
        var tempRow = void 0;

        for (var i = 0; i < this.size; i++) {
            tempRow = [];

            for (var j = 0; j < this.size; j++) {
                tempRow.push(new BoardSlot());
            }

            tempBoard.push(tempRow);
        }

        this._board = tempBoard;
    }

    GetEmptyNeighbor(position, secondaryBoard) {
        var spawnLocation = void 0;
        var locations = this.GetEmptyNeighbors(position);

        if (locations.length > 0) {
            spawnLocation = Helpers.GetRandomInRange(0, locations.length - 1);
            return locations[spawnLocation];
        }

        return null;
    }

    GetEmptyNeighbors(position) {
        var minMaxX = this._GetBoardMinMaxLocations(position.x);
        var minMaxY = this._GetBoardMinMaxLocations(position.y);
        var locations = [];
        var spawnLocation = void 0;

        for (var i = minMaxX.min; i <= minMaxX.max; i++) {
            for (var j = minMaxY.min; j <= minMaxY.max; j++) {
                if (this._board[i][j].value === 0) {
                    locations.push({ x: i, y: j });
                }
            }
        }

        return locations;
    }

    GetNeighbors(position) {
        var minMaxX = this._GetBoardMinMaxLocations(position.x);
        var minMaxY = this._GetBoardMinMaxLocations(position.y);
        var neighbors = [];

        for (var i = minMaxX.min; i <= minMaxX.max; i++) {
            for (var j = minMaxY.min; j <= minMaxY.max; j++) {
                if (this._board[i][j].value !== 0 && (i !== position.x || j !== position.y)) {
                    neighbors.push(this._board[i][j].value);
                }
            }
        }

        return neighbors;
    }

    IsSlotEmpty(x, y) {
        if (!x || !y || x < 0 || y < 0 || x >= this.size || y >= this.size) 
            return false;
        
        return this._board[x][y].value === 0;
    }

    Print() {
        var row;

        for (var i = 0; i < this.size; i++) {
            row = "| ";

            for (var j = 0; j < this.size; j++) {
                row += (Number.isInteger(this._board[j][i].value) ? "\x1b[31m-\x1b[0m" : this._board[j][i].value.character) + " | ";
            }

            console.log(row);
        }
    }

    _GetBoardMinMaxLocations(singleAxisPoint) {
        var minMax = { min: 0, max: 0 };

        if (singleAxisPoint < 1)
            minMax.min = singleAxisPoint;
        else
            minMax.min = singleAxisPoint - 1;

        if (singleAxisPoint === this.size - 1)
            minMax.max = singleAxisPoint;
        else
            minMax.max = singleAxisPoint + 1;

        return minMax;
    }

    _RemoveDeadCells() {
        for (var i = 0, len = this.cells.length; i < len; i++) {
            if (!this.cells[i]._alive) {
                this.cells.splice(i, 1);

                // Since we removed the cell at that location dec i and len
                i--;
                len--;
            }
        }
    }
}

module.exports = Board;