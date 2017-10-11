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

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Board {
    constructor(size) {
        this.size = size;
        this._board = void 0;
        this.cells = [];
    }

    Update(changedBoard) {
        this._board = changedBoard._board;
        this.cells = this.cells.concat(changedBoard.cells);
    }

    Populate() {
        var addedCells = [];
        var direction = new Point(1, 2);
        var position = new Point(Math.floor(this.size / 2), Math.floor(this.size / 2));
        var cell = new Cell(2, 1, direction, position, "life", false);

        this.PlaceCell(cell, position);
    }

    PlaceCell(cell, position) {
        this._board[position.x][position.y] = cell;
        this.cells.push(cell);
    }

    Generate() {
        var tempBoard = [];
        var tempRow = void 0;

        for (var i = 0; i < this.size; i++) {
            tempRow = [];

            for (var j = 0; j < this.size; j++) {
                tempRow.push(0);
            }

            tempBoard.push(tempRow);
        }

        this._board = tempBoard;
    }

    Print() {
        var row;

        for (var i = 0; i < this.size; i++) {
            row = "| ";

            for (var j = 0; j < this.size; j++) {
                row += (Number.isInteger(this._board[j][i]) ? this._board[j][i] : "X") + " | ";
            }

            console.log(row);
        }
    }

    GetEmptyNeighbor(position, secondaryBoard) {
        var minMaxX = this._GetBoardMinMaxLocations(position.x);
        var minMaxY = this._GetBoardMinMaxLocations(position.y);
        var locations = [];
        var spawnLocation = void 0;

        for (var i = minMaxX.min; i <= minMaxX.max; i++) {
            for (var j = minMaxY.min; j <= minMaxY.max; j++) {
                if (this._board[i][j] === 0 && secondaryBoard._board[i][j] === 0) {
                    locations.push({ x: i, y: j });
                }
            }
        }

        if (locations.length > 0) {
            spawnLocation = getRandomInRange(0, locations.length - 1);
            return locations[spawnLocation];
        }

        return null;
    }

    GetNeighbors(position) {
        var minMaxX = this._GetBoardMinMaxLocations(position.x);
        var minMaxY = this._GetBoardMinMaxLocations(position.y);
        var neighbors = [];

        for (var i = minMaxX.min; i <= minMaxX.max; i++) {
            for (var j = minMaxY.min; j <= minMaxY.max; j++) {
                if (this._board[i][j] !== 0 && (i !== position.x && j !== position.y)) {
                    neighbors.push(this._board[i][j]);
                }
            }
        }

        return neighbors;
    }

    _GetBoardMinMaxLocations(singleAxisPoint) {
        var minMax = { min: 0, max: 0 };

        if (singleAxisPoint < 1)
            minMax.min = singleAxisPoint;
        else
            minMax.min = singleAxisPoint - 1;

        if (singleAxisPoint === this.size - 1)
            minMax.max = singleAxisPoint;
        else
            minMax.max = singleAxisPoint + 1;

        return minMax;
    }
}

class cellProperty {
    constructor(value, moveAble) {
        this.value = value;
        this.moveAble = moveAble;
    }

    IsMoveAble() {
        return this.moveAble;
    }
}

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
            var spawnCount = getRandomInRange(1, this.properties.maxOffSpring.value);
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

            if (shouldLive)
                tempBoard._board[this.properties.position.value.x][this.properties.position.value.y] = this;
            
        } else {
            this._alive = false;
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

function getRandomInRange(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

var game = new CellGame(20);
game.Play();