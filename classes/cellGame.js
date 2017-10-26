const Point = require('./point');
const Board = require('./board');
const Cell = require('./cell');
const Helpers = require('./helpers');

class CellGame {
    constructor(size, cellTypes) {
        this.size = size;
        this.board = new Board(size);
        this.board.Generate();
        this.board.Populate(cellTypes);

        this.interval = Helpers.GetTimeInterval();
    }

    Play(generation) {
        generation = generation || 0;
        console.log("Generation: " + ++generation);

        console.log("Pre: ");
        this.board.Print();
        this.PlayRound();
        console.log("Post: ");
        this.board.Print();

        console.log(" ");

        setTimeout(this.Play.bind(this, generation), this.interval);
    }

    PlayRound() {
        var cell = void 0;
        var cells = this.board.cells.slice(0);

        for (var i = 0, len = cells.length; i < len; i++) {
            cell = cells[i];

            if (cell._alive) {
                cell.Update(this.board); //update cell
                cell.Divide(this.board); //spawn children
            }

        }
    }
}

module.exports = CellGame;