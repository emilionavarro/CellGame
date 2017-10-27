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

    Update(board) {
        this._generation++;
        this._deathCheck(board);
        this._divide(board, this._getSpawnCount());
    }

    Divide(board, spawnCount, slots) {
        var chosenSlots = [];

        for (var i = 0, len = slots.length; i < len && i < spawnCount; i++) {
            chosenSlots.push(slots[i]);
        }

        return chosenSlots;
    }

    _divide(board, spawnCount) {
        if (this._alive) {
            var child = void 0;
            var availableSlots = board.GetEmptyNeighbors(this.position);
            var chosenSlots = this.Divide(board, spawnCount, availableSlots);

            //TODO: validate chosenslots

            for(var i = 0, len = chosenSlots.length; i < len && i < spawnCount ; i++) {
                child = this.CreateChild(chosenSlots[i]);
                board.PlaceCell(child, chosenSlots[i]);
                this.food -= this.attributes[Genes.FoodRequirement];
            }

        }
    }

    _getSpawnCount() {
        var maxOffspringAllowed = Helpers.GetRandomInRange(1, this.attributes[Genes.MaxOffspring]);
        var maxOffspringPossible = Math.floor(this.food / this.attributes[Genes.FoodRequirement]);
        
        if (maxOffspringPossible > maxOffspringAllowed) { 
            return maxOffspringAllowed;
        } else {
            return maxOffspringPossible;
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

    Move (board) {
       
    }

    GetType() {
        return "Generic";
    }

    CanMove(direction, quantity, board) {
        if (direction === true) {
            // Vertical
            return board.IsSlotEmpty(this.position.x, this.position.y + quantity);
        } else {
            // Horizontal
            return board.IsSlotEmpty(this.position.x + quantity, this.position.y);
        }
    }

    _setCharacter() {
        this.character = "-";
    }

    _print() {
        Helpers.printCell(this);
    }

    _setMutation () {
        this.mutation = Mutations.InsertionMutation;
    }

    _deathCheck(board) {
        if (this._shouldDieFromAge() || this._shouldDieFromEnemyCount()) {
            this._die(board);
        } else {
            this.Move(board);
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
}

module.exports = Cell;