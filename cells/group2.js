const Cell = require('../classes/cell');
const Genes = require('./../enums/genes');
const Helpers = require('./../classes/helpers');

class Group2 extends Cell {
    constructor (lifeSpan, maxOffspring, direction, position, mutate) {
        super(lifeSpan, maxOffspring, direction, position, "Group2", mutate);
        this.SetCharacter();
    }

    SetCharacter() {
        this.character = "\x1b[34m" + "O" + "\x1b[0m";
    }

    GetType() {
        return "Group 2";
    }

    SetMutation() {
        this.mutation = this.DisplacementMutation;
    }

    MoveCell (board) {
        var moveLocation = void 0;
        var quantity = Helpers.GetRandomInRange(0, 1);
        if (quantity === 0)
            quantity--;

        var direction = false; // start with horizontal
        var maxX = this.attributes[Genes.MoveX];
        var maxY = this.attributes[Genes.MoveY];
        var moveable = void 0;
        var canMoveX = true;
        var canMoveY = true;
        while ((maxX !== 0 || maxY !== 0) && (canMoveX || canMoveY)) {
            moveable = this.CanMove(direction, quantity, board);

            if(!direction){
                if (moveable && maxX !== 0) {
                    // Remove cell from old location
                    board._board[this.position.x][this.position.y].Reset(0);
                    moveLocation = {x: this.position.x + quantity, y: this.position.y};
                    this.position.x = this.position.x + quantity;
                    board.MoveCell(this, moveLocation);

                    // dec movement on x
                    maxX--;

                    canMoveX = true;
                } else {
                    direction = !direction;
                    quantity = Helpers.GetRandomInRange(0, 1);
                    if (quantity === 0)
                        quantity--;

                    canMoveX = false;
                }
            } else {
                if (moveable && maxY !== 0) {
                    // Remove cell from old location
                    board._board[this.position.x][this.position.y].Reset(0);
                    moveLocation = {x: this.position.x, y: this.position.y + quantity};
                    this.position.y = this.position.y + quantity;
                    board.MoveCell(this, moveLocation);

                    // dec movemenet on y
                    maxY--;

                    canMoveY = true;
                } else {
                    direction = !direction;
                    quantity = Helpers.GetRandomInRange(0, 1);
                    if (quantity === 0)
                        quantity--;

                    canMoveY = false;
                }
            }
        }
    }
}

module.exports = Group2;