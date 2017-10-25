const cellProperty = require('./cellProperty');
const Helpers = require('./Helpers');
const Point = require('./Point');

class Cell {
    constructor(lifeSpan, maxOffspring, direction, position, family, mutate) {
        this.properties = {
            generation: new cellProperty(0, false),
            maxLifeSpan: new cellProperty(lifeSpan, true),
            maxOffSpring: new cellProperty(maxOffspring, true),
            xMovement: new cellProperty(direction.x, true),
            yMovement: new cellProperty(direction.y, true),
            family: new cellProperty(family, false),
            position: new cellProperty(position, false),
            foodRequirement: new cellProperty(Helpers.GetRandomInRange(1, 3), true)
        };

        this._alive = true;
        this.food = 0;
        this.character = '-';

        this.SetMutation();

        // See if we need to mutate this cell
        if (mutate) {
            this.MutateCell();
        }
    }

    SetCharacter() {
        this.character = "-";
    }

    Print() {
        console.log("Generation: " + this.properties.generation.value);
        console.log("Location: " + this.properties.position.value.x + "," + this.properties.position.value.y);
        console.log("Max life: " + this.properties.maxLifeSpan.value);
        console.log("xMovement: " + this.properties.xMovement.value);
        console.log("yMovement: " + this.properties.yMovement.value);
    }

    Divide(board) {
        if (this._alive) {
            var spawnCount = Helpers.GetRandomInRange(1, this.properties.maxOffSpring.value);
            var spawnLocation = void 0;

            for (var i = 0; i < spawnCount; i++) {
                if (this.food > this.properties.foodRequirement.value) {
                    spawnLocation = board.GetEmptyNeighbor(this.properties.position.value, board);

                    //TODO: resolve children placement conflicts

                    if (spawnLocation) {
                        //create child
                        var child = this.CreateChild(spawnLocation);
                        board.PlaceCell(child, spawnLocation);
                        this.food -= this.properties.foodRequirement.value;
                    }
                } else {
                    //not enough food to attempt division
                    break;
                }
            }
        }
    }

    CreateChild(position) {
        return new Cell(this.properties.maxLifeSpan.value,
            this.properties.maxOffSpring.value,
            { x: this.properties.xMovement.value, y: this.properties.yMovement.value },
            position,
            this.properties.family.value,
            true);
    }

    Update(board) {
        //rules
        var neighbors = void 0;
        var shouldLive = true;

        this.properties.generation.value++;

        if (this.properties.generation.value <= this.properties.maxLifeSpan.value) {
            //place cell on temp board
            neighbors = board.GetNeighbors(this.properties.position.value);
            
            if (neighbors.length >= 3) {
                var enemyCount = 0;

                for (var i = 0, len = neighbors.length; i < len; i++) {
                    if (neighbors[i].properties.family.value !== this.properties.family.value) {
                        enemyCount++;
                    }
                }

                if (enemyCount >= 3) 
                    shouldLive = false;
            }

            if (shouldLive) {
                //move cell, then place on temp board
                this.MoveCell(board);

                board._board[this.properties.position.value.x][this.properties.position.value.y].value = this;
            }                
            
        } else {
            this._alive = false;
            board._board[this.properties.position.value.x][this.properties.position.value.y].Reset(this.food);
        }
    }

    MutateCell() {
        // Build array of values
        var mutationArray = [];
        var numberOfMoveableAttributes = 0;
        for (var key in this.properties) {
            if (this.properties[key].IsMoveAble()) {
                numberOfMoveableAttributes++;
                mutationArray.push(this.properties[key]);
            }
        }

        // Insertion mutation
        mutationArray = this.mutation(mutationArray, numberOfMoveableAttributes);

        // Now mutate the cell
        var i = 0;
        for (var key in this.properties) {
            if (this.properties[key].IsMoveAble()) {
                this.properties[key] = mutationArray[i++];
            }
        }
    }

    SetMutation (){
        this.mutation = this.InsertionMutation;
    }


    InsertionMutation(mutationArray, numberOfMoveableAttributes) {
        var mutationFromIndex = Math.random();
        var mutationToIndex = Math.random();
        mutationFromIndex = (Math.floor(numberOfMoveableAttributes * mutationFromIndex));
        mutationToIndex = (Math.floor(numberOfMoveableAttributes * mutationToIndex));

        var movingMutation = mutationArray[mutationFromIndex];
        mutationArray.splice(mutationFromIndex, 1);
        mutationArray.splice(mutationToIndex, 0, movingMutation);
        return mutationArray;
    }

    ExchangeMutation (mutationArray, numberOfMoveableAttributes) {
        var mutationFromIndex = this.GetRandomMutationIndex(numberOfMoveableAttributes);
        var mutationToIndex = this.GetRandomMutationIndex(numberOfMoveableAttributes);
        var movingMutation = mutationArray[mutationFromIndex];

        // Verify that we dont add to the end something that does not exist anymore.
        if (mutationToIndex === numberOfMoveableAttributes) 
            mutationToIndex = numberOfMoveableAttributes - 1;
            
        mutationArray.splice(mutationFromIndex, 1, mutationArray[mutationToIndex]);
        mutationArray.splice(mutationToIndex, 1, movingMutation);
        return mutationArray;
    }

    DisplacementMutation (mutationArray, numberOfMoveableAttributes) {
        //TODO: fix this mutation
        var mutationFromIndex = this.GetRandomMutationIndex(numberOfMoveableAttributes);
        var mutationToIndex = this.GetRandomMutationIndex(numberOfMoveableAttributes);
        var mutationLength = this.GetRandomMutationIndex(numberOfMoveableAttributes);
        var movingMutation = [];

        if (mutationFromIndex > mutationToIndex) {
            if ((mutationFromIndex + mutationLength) > numberOfMoveableAttributes)
                mutationLength = numberOfMoveableAttributes - mutationFromIndex;
        }

        movingMutation = mutationArray.splice(mutationFromIndex, mutationLength);
        mutationArray.splice(mutationToIndex, mutationLength, movingMutation);
        return mutationArray;
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
        var maxX = this.properties.xMovement.value;
        while ((maxX !== 0) && this.CanMove(direction, quantity, board)) {
            // Remove cell from old location
            board._board[this.properties.position.value.x][this.properties.position.value.y].Reset(0);
            moveLocation = {x: this.properties.position.value.x + quantity, y: this.properties.position.value.y};
            this.properties.position.value.x = this.properties.position.value.x + quantity;
            board.MoveCell(this, moveLocation);

            // dec movement on x
            maxX--;
        }

        direction = true; // now do vertical
        quantity = Helpers.GetRandomInRange(0, 1);
        if (quantity === 0)
            quantity--;

        var maxY = this.properties.yMovement.value;
        while ((maxY !== 0) && this.CanMove(direction, quantity, board)) {
            // Remove cell from old location
            board._board[this.properties.position.value.x][this.properties.position.value.y].Reset(0);
            moveLocation = {x: this.properties.position.value.x, y: this.properties.position.value.y + quantity};
            this.properties.position.value.y = this.properties.position.value.y + quantity;
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
            if (((this.properties.position.value.y + quantity) >= board.size) ||
                ((this.properties.position.value.y + quantity) < 0)) {
                return false;
            }

            // Check if cell exists here
            var newX = this.properties.position.value.x;
            var newY = (this.properties.position.value.y + quantity);
            if (board._board[newX][newY].value !== 0)
                return false;
        } else {
            // Horizontal
            // Check if off board
            if (((this.properties.position.value.x + quantity) >= board.size) ||
                ((this.properties.position.value.x + quantity) < 0)) {
                return false;
            }

            // Check if cell exists here
            var newX = (this.properties.position.value.x + quantity);
            var newY = this.properties.position.value.y;
            if (board._board[newX][newY].value !== 0)
                return false;
        }

        return true;
    }
}

module.exports = Cell;