const Point = require('./Point');
const Board = require('./Board');
const Cell = require('./Cell');
const cellProperty = require('./cellProperty');

class CellGame {
    constructor(size) {
        this.size = size;
        this.board = new Board(size);
        this.tempBoard = void 0;
        this.board.Generate();
        this.board.Populate();

        this.interval = 1000;
    }

    Play(generation) {
        generation = generation || 0;
        console.log("Generation: " + ++generation);

        this.PlayRound();

        this.board.Print();
        console.log(" ");

        setTimeout(this.Play.bind(this, generation), this.interval);
    }

    PlayRound() {
        var cell = void 0;
        var cells = this.board.cells.slice(0);

        this.tempBoard = new Board(this.size);
        this.tempBoard.Generate();

        for (var i = 0, len = cells.length; i < len; i++) {
            cell = cells[i];

            if (cell._alive) {
                cell.Update(this.board, this.tempBoard); //update cell
                cell.Divide(this.tempBoard, this.board); //spawn children
            }


        }

        this.board.Update(this.tempBoard); //update board
    }
}

module.exports = CellGame;