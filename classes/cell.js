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

            if (shouldLive) {
                //move cell, then place on temp board
                this.MoveCell(board, tempBoard);

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

    MoveCell (board, tempBoard) {
        var moveLocation = void 0;
        var quantity = Helpers.GetRandomInRange(0, 1);
        if (quantity === 0)
            quantity--;

        var direction = false; // start with horizontal
        var maxX = this.properties.xMovement.value;
        while ((maxX !== 0) && this.CanMove(direction, quantity, tempBoard) && this.CanMove(direction, quantity, board)) {
            // Remove cell from old location
            tempBoard._board[this.properties.position.value.x][this.properties.position.value.y].Reset();
            moveLocation = {x: this.properties.position.value.x + quantity, y: this.properties.position.value.y};
            this.properties.position.value.x = this.properties.position.value.x + quantity;
            tempBoard.MoveCell(this, moveLocation);

            // dec movement on x
            maxX--;
        }

        direction = true; // now do vertical
        quantity = Helpers.GetRandomInRange(0, 1);
        if (quantity === 0)
            quantity--;

        var maxY = this.properties.yMovement.value;
        while ((maxY !== 0) && this.CanMove(direction, quantity, tempBoard) && this.CanMove(direction, quantity, board)) {
            // Remove cell from old location
            tempBoard._board[this.properties.position.value.x][this.properties.position.value.y].Reset();
            moveLocation = {x: this.properties.position.value.x, y: this.properties.position.value.y + quantity};
            this.properties.position.value.y = this.properties.position.value.y + quantity;
            tempBoard.MoveCell(this, moveLocation);

            // dec movemenet on y
            maxY--;
        }
    }

    CanMove(direction, quantity, tempBoard) {
        if (direction === true) {
            // Vertical
            // Check if off board
            if (((this.properties.position.value.y + quantity) >= tempBoard.size) ||
                ((this.properties.position.value.y + quantity) < 0)) {
                return false;
            }

            // Check if cell exists here
            var newX = this.properties.position.value.x;
            var newY = (this.properties.position.value.y + quantity);
            if (tempBoard._board[newX][newY].value !== 0)
                return false;
        } else {
            // Horizontal
            // Check if off board
            if (((this.properties.position.value.x + quantity) >= tempBoard.size) ||
                ((this.properties.position.value.x + quantity) < 0)) {
                return false;
            }

            // Check if cell exists here
            var newX = (this.properties.position.value.x + quantity);
            var newY = this.properties.position.value.y;
            if (tempBoard._board[newX][newY].value !== 0)
                return false;
        }

        return true;
    }
}

module.exports = Cell;