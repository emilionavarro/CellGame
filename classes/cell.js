const Helpers = require('./Helpers');
const Point = require('./Point');
const Genes = require('./../enums/Genes');

class Cell {
    constructor(lifeSpan, maxOffspring, direction, position, family, mutate) {
        this.attributes = [];

        this.attributes.push(lifeSpan, maxOffspring, direction.x, direction.y, Helpers.GetRandomInRange(1, 3));

        this._generation = 0;
        this._family = family;
        this._alive = true;

        this.position = position;
        this.food = 0;

        this.SetCharacter();
        this.SetMutation();

        if (mutate) {
            this.mutation();
        }
    }

    SetCharacter() {
        this.character = "-";
    }

    Print() {
        console.log("Generation: " + this._generation);
        console.log("Location: " + this.position.x + "," + this.position.y);
        console.log("Max life: " + this.attributes[Genes.LifeSpan]);
        console.log("xMovement: " + this.attributes[Genes.MoveX]);
        console.log("yMovement: " + this.attributes[Genes.MoveY]);
        console.log("maxOffSpring: " + this.attributes[Genes.MaxOffspring]);

    }

    Divide(board) {
        if (this._alive) {
            var spawnCount = Helpers.GetRandomInRange(1, this.attributes[Genes.MaxOffspring]);
            var spawnLocation = void 0;

            for (var i = 0; i < spawnCount; i++) {
                if (this.food > this.attributes[Genes.FoodRequirement]) {
                    spawnLocation = board.GetEmptyNeighbor(this.position, board);

                    //TODO: resolve children placement conflicts

                    if (spawnLocation) {
                        //create child
                        var child = this.CreateChild(spawnLocation);
                        board.PlaceCell(child, spawnLocation);
                        this.food -= this.attributes[Genes.FoodRequirement];
                    }
                } else {
                    //not enough food to attempt division
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
        //rules
        var neighbors = void 0;
        var shouldLive = true;

        this._generation++;

        if (this._generation <= this.attributes[Genes.LifeSpan]) {
            //place cell on temp board
            neighbors = board.GetNeighbors(this.position);
            
            if (neighbors.length >= 3) {
                var enemyCount = 0;

                for (var i = 0, len = neighbors.length; i < len; i++) {
                    if (neighbors[i]._family !== this._family) {
                        enemyCount++;
                    }
                }

                if (enemyCount >= 3) 
                    shouldLive = false;
            }

            if (shouldLive) {
                //move cell, then place on temp board
                this.MoveCell(board);

                board._board[this.position.x][this.position.y].value = this;
            }                
            
        } else {
            this._alive = false;
            board._board[this.position.x][this.position.y].Reset(this.food);
        }
    }

    SetMutation (){
        this.mutation = this.InsertionMutation;
    }


    InsertionMutation () {
        var len = this.attributes.length;

        var mutationFromIndex = this.GetRandomMutationIndex(len);
        var mutationToIndex = this.GetRandomMutationIndex(len);
        var movingMutation = this.attributes[mutationFromIndex];
        
        // Verify that we dont add to the end something that does not exist anymore.
        if (mutationToIndex === len)
        mutationToIndex = len - 1;
        
        this.attributes.splice(mutationFromIndex, 1);
        this.attributes.splice(mutationToIndex, 0, movingMutation);
    }

    ExchangeMutation () {
        var len = this.attributes.length;
        var mutationFromIndex = this.GetRandomMutationIndex(len);
        var mutationToIndex = this.GetRandomMutationIndex(len);
        var movingMutation = this.attributes[mutationFromIndex];

        // Verify that we dont add to the end something that does not exist anymore.
        if (mutationToIndex === len) 
            mutationToIndex = len - 1;
            
        this.attributes.splice(mutationFromIndex, 1, this.attributes[mutationToIndex]);
        this.attributes.splice(mutationToIndex, 1, movingMutation);
    }

    DisplacementMutation () {
        var len = this.attributes.length;
        //TODO: fix this mutation
        var mutationFromIndex = this.GetRandomMutationIndex(len);
        var mutationToIndex = this.GetRandomMutationIndex(len);
        var mutationLength = this.GetRandomMutationIndex(len);
        var movingMutation = [];

        if (mutationFromIndex > mutationToIndex) {
            if ((mutationFromIndex + mutationLength) > len)
                mutationLength = len - mutationFromIndex;
        }

        movingMutation = this.attributes.splice(mutationFromIndex, mutationLength);
        this.attributes.splice(mutationToIndex, mutationLength, movingMutation);
    }

    GetRandomMutationIndex(numberTo) {
        return (Math.floor(numberTo * Math.random()));
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