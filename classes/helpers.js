class Helpers {
    constructor () {   
    }

    static GetRandomInRange(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    static GetTimeInterval() {
        return 1000;
    }

    static GetBoardSize() {
        return 5;
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
}

module.exports = Helpers;