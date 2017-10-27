const Cell = require('../classes/cell');
const Genes = require('./../enums/genes');
const Helpers = require('./../classes/helpers');

class genericCell extends Cell {
    constructor (lifeSpan, maxOffspring, direction, position, mutate) {
        super(lifeSpan, maxOffspring, direction, position, "Generic", mutate);
        this.SetCharacter();
    }

    SetCharacter() {
        this.character = "\x1b[1m" + "X" + "\x1b[0m";
    }

    GetType() {
        return "Generic";
    }

    Move (board) {
        var moveLocation = void 0;
        var quantity = Helpers.GetRandomInRange(0, 1);
        if (quantity === 0)
            quantity--;

        var direction = false; // start with horizontal
        var maxX = this.attributes[Genes.MoveX];
        while ((maxX !== 0) && this.CanMove(direction, quantity, board)) {
            // Remove cell from old location
            board._board[this.position.x][this.position.y].Reset(0);
            moveLocation = {x: this.position.x + quantity, y: this.position.y};
            this.position.x = this.position.x + quantity;
            board.MoveCell(this, moveLocation);

            // dec movement on x
            maxX--;
        }

        direction = true; // now do vertical
        quantity = Helpers.GetRandomInRange(0, 1);
        if (quantity === 0)
            quantity--;

        var maxY = this.attributes[Genes.MoveY];
        while ((maxY !== 0) && this.CanMove(direction, quantity, board)) {
            // Remove cell from old location
            board._board[this.position.x][this.position.y].Reset(0);
            moveLocation = {x: this.position.x, y: this.position.y + quantity};
            this.position.y = this.position.y + quantity;
            board.MoveCell(this, moveLocation);

            // dec movemenet on y
            maxY--;
        }
        
    }
}

module.exports = genericCell;