const Cell = require('../classes/cell');
const Genes = require('./../enums/genes');
const Helpers = require('./../classes/helpers');

class TestCell extends Cell {
    constructor (lifeSpan, maxOffspring, direction, position, mutate) {
        super(lifeSpan, maxOffspring, direction, position, "LEO", mutate);
        this.SetCharacter();
    }

    SetCharacter() {
        this.character = "\x1b[1m" + "♫" + "\x1b[0m";
    }

    GetType() {
        return "LEO";
    }

    MoveSlow(board) {
        var moveLocation = void 0;
        var quantity = -1;

        var direction = false; // start with horizontal
        var maxX = this.attributes[Genes.MoveX];
        var maxY = this.attributes[Genes.MoveY];

        var nomoves = 0;
        var moved = false;

        while(maxX !== 0 || maxY !== 0) {
            moved = false;
            if (maxX > 0 && this.CanMove(false, quantity, board)) {

                board._board[this.position.x][this.position.y].Reset(0);
                moveLocation = {x: this.position.x + quantity, y: this.position.y};
                this.position.x = this.position.x + quantity;
                board.MoveCell(this, moveLocation);
                maxX--;
                moved = true;
            }

            if (maxY > 0 && this.CanMove(true, quantity, board)) {
    
                board._board[this.position.x][this.position.y].Reset(0);
                moveLocation = {x: this.position.x, y: this.position.y + quantity};
                this.position.y = this.position.y + quantity;
                board.MoveCell(this, moveLocation);
                maxY--;
                moved = true;
                
            }

            quantity = 1;

            if (maxX > 0 && this.CanMove(false, quantity, board)) {

                board._board[this.position.x][this.position.y].Reset(0);
                moveLocation = {x: this.position.x + quantity, y: this.position.y};
                this.position.x = this.position.x + quantity;
                board.MoveCell(this, moveLocation);
                maxX--;
                moved = true;

            }

            if (maxY > 0 && this.CanMove(true, quantity, board)) {
    
                board._board[this.position.x][this.position.y].Reset(0);
                moveLocation = {x: this.position.x, y: this.position.y + quantity};
                this.position.y = this.position.y + quantity;
                board.MoveCell(this, moveLocation);
                maxY--;
                moved = true;

            }

            if (!moved) {
                nomoves++;
            }

            if (nomoves === 5) {
                break;
            }
        }
    }
    Move (board) {

        this.MoveSlow(board);
        return;
        
    }
}

module.exports = TestCell;