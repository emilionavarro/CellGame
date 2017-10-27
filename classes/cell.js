const Helpers = require('./helpers');
const Point = require('./point');
const Genes = require('./../enums/genes');
const Mutations = require('./mutations.js');
const MutationTypes = require('./../enums/mutationTypes');

class Cell {
    constructor(lifeSpan, maxOffspring, direction, position, family, mutate) {
        this.attributes = [];
        this.attributes.push(lifeSpan, maxOffspring, direction.x, direction.y, Helpers.GenerateStartFoodRequirement());

        this._generation = 0;
        this._family = family;
        this._alive = true;

        this.position = position;
        this.food = Helpers.GenerateStartFood();

        this._setCharacter();
        this._setMutation();

        if (mutate) {
            this.mutation(this);
        }
    }

    _setCharacter() {
        this.character = "-";
    }

    Print() {
        Helpers.printCell(this);
    }

    Divide(board) {
        if (this._alive) {
            var spawnCount = Helpers.GetRandomInRange(1, this.attributes[Genes.MaxOffspring]);
            var spawnLocation = void 0;

            for (var i = 0; i < spawnCount; i++) {
                if (this.food > this.attributes[Genes.FoodRequirement]) {
                    spawnLocation = board.GetEmptyNeighbor(this.position, board);

                    if (spawnLocation) {
                        var child = this.CreateChild(spawnLocation);
                        board.PlaceCell(child, spawnLocation);
                        this.food -= this.attributes[Genes.FoodRequirement];
                    }
                } else {
                    break;
                }
            }
        }
    }

    CreateChild(position) {
        return new this.__proto__.constructor(this.attributes[Genes.LifeSpan],
            this.attributes[Genes.MaxOffspring],
            { x: this.attributes[Genes.MoveX], y: this.attributes[Genes.MoveY] },
            position,
            this._family,
            true);
    }

    Update(board) {
        this._generation++;
        this._deathCheck(board);
        this.Divide(board);
    }

    _setMutation () {
        this.mutation = Mutations.InsertionMutation;
    }

    _deathCheck(board) {
        if (this._shouldDieFromAge() || this._shouldDieFromEnemyCount()) {
            this._die(board);
        } else {
            this.MoveCell(board);
        }
    }

    _die(board) {
        this._alive = false;
        board._board[this.position.x][this.position.y].Reset(this.food);
    }

    _shouldDieFromAge() {
        return !(this._generation <= this.attributes[Genes.LifeSpan]);
    }

    _shouldDieFromEnemyCount(board) {
        if (!board) 
            return false;

        var deathSquadCount = Helpers.GetAllowedSurroundingEnemys(),
        neighbors = board.GetNeighbors(this.position),
        enemyCount = 0,
        shouldLive = true;

        if (neighbors.length >= deathSquadCount) {      
            for (var i = 0, len = neighbors.length; i < len; i++) {
                if (neighbors[i]._family !== this._family) 
                    enemyCount++;                

                if (enemyCount >= deathSquadCount) 
                    return true;
            }            
        }

        return false;
    }

    MoveCell (board) {
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

    GetType() {
        return "Generic";
    }

    CanMove(direction, quantity, board) {
        if (direction === true) {
            // Vertical
            // Check if off board
            if (((this.position.y + quantity) >= board.size) ||
                ((this.position.y + quantity) < 0)) {
                return false;
            }

            // Check if cell exists here
            var newX = this.position.x;
            var newY = (this.position.y + quantity);
            if (board._board[newX][newY].value !== 0)
                return false;
        } else {
            // Horizontal
            // Check if off board
            if (((this.position.x + quantity) >= board.size) ||
                ((this.position.x + quantity) < 0)) {
                return false;
            }

            // Check if cell exists here
            var newX = (this.position.x + quantity);
            var newY = this.position.y;
            if (board._board[newX][newY].value !== 0)
                return false;
        }

        return true;
    }
}

module.exports = Cell;