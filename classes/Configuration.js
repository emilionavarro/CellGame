const Helpers = require('./helpers');

class Config {
    constructor () {
    }

    static GetTimeInterval() {
        return 1000;
    }

    static GetBoardSize() {
        return 20;
    }

    static GetBoardStartingMinFood() {
        return 2;
    }

    static GetBoardStartingMaxFood() {
        return 4;
    }

    static GetBoardNewMinFood() {
        return 1;
    }

    static GetBoardNewMaxFood() {
        return 3;
    }

    static GetAllowedSurroundingEnemys() {
        return 3;
    }

    static GetBoardRemoveOldTimer() {
        return 10;
    }

    // Start cell max life
    static GenerateStartMaxLife() {
        return 2;
    }

    // Start cell max children
    static GenerateStartMaxChildren() {
        return 1;
    }

    // Start cell movement either X or Y
    static GenerateStartMaxMovement() {
        return Helpers.GetRandomInRange(1, Math.ceil(this.GetBoardSize() / 5));
    }

    // Start cell food requirement for children.
    static GenerateStartFoodRequirement() {
        return Helpers.GetRandomInRange(1, 3);
    }

    // start cell Starting food
    static GenerateStartFood() {
        return 0;
    }
}

module.exports = Config;