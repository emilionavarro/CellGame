const cellProperty = require('./cellProperty');
const Helpers = require('./Helpers');

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
        };

        this._alive = true;
        this.food = 0;

        // See if we need to mutate this cell
        if (mutate) {
            this.MutateCell();
        }
    }

    Print() {
        console.log("Generation: " + this.properties.generation.value);
        console.log("Location: " + this.properties.position.value.x + "," + this.properties.position.value.y);
        console.log("Max life: " + this.properties.maxLifeSpan.value);
        console.log("xMovement: " + this.properties.xMovement.value);
        console.log("yMovement: " + this.properties.yMovement.value);
    }

    Divide(tempBoard, board) {
        if (this._alive) {
            var spawnCount = Helpers.GetRandomInRange(1, this.properties.maxOffSpring.value);
            var spawnLocation = void 0;

            for (var i = 0; i < spawnCount; i++) {
                spawnLocation = board.GetEmptyNeighbor(this.properties.position.value, tempBoard);

                //TODO: resolve children placement conflicts

                if (spawnLocation) {
                    //create child
                    var child = this.CreateChild(spawnLocation);
                    tempBoard.PlaceCell(child, spawnLocation);
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

    Update(board, tempBoard) {
        //rules
        var neighbors = void 0;
        var shouldLive = true;

        this.properties.generation.value++;

        if (this.properties.generation.value <= this.properties.maxLifeSpan.value) {
            //place cell on temp board
            neighbors = board.GetNeighbors(this.properties.position.value);
            
            if (neighbors.length >= 3)
                shouldLive = false;

            if (shouldLive){
                //move cell, then place on temp board
                

                tempBoard._board[this.properties.position.value.x][this.properties.position.value.y].value = this;
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
        mutationArray = this.InsertionMutation(mutationArray, numberOfMoveableAttributes);

        // Now mutate the cell
        var i = 0;
        for (var key in this.properties) {
            if (this.properties[key].IsMoveAble()) {
                this.properties[key] = mutationArray[i++];
            }
        }
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
}

module.exports = Cell;