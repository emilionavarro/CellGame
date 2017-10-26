const Helpers = require('./helpers');

class BoardSlot {
    constructor () {
        this.value = 0;
        this.food = Helpers.GetRandomInRange(Helpers.GetBoardStartingMinFood(), Helpers.GetBoardStartingMaxFood());
    }

    Reset(food) {
        if (food !== null) {
            this.food = food;
        } else {
            this.food = Helpers.GetRandomInRange(Helpers.GetBoardNewMinFood(), Helpers.GetBoardNewMaxFood());
        }

        this.value = 0; //remove cell from board slot
    }

    Harvest() {
        var harvestedAmount = this.food;
        this.food = 0;
        return harvestedAmount;
    }

    MovedIn(cell) {
        this.value = cell;
        cell.food = this.Harvest();
    }

    MovedOut() {
        this.Reset(0);
    }
}

module.exports = BoardSlot;