const Helpers = require('./Helpers');

class BoardSlot {
    constructor () {
        this.value = 0;
        this.food = Helpers.GetRandomInRange(1, 3);
    }

    Reset(food) {
        // Default food
        food = food || 0;

        // add the passed in food to the slot, and add a random amount of food on top of that
        this.value = 0;
        this.food = Helpers.GetRandomInRange(1, 3) + food;
    }

    Harvest() {
        var harvestedAmount = this.food;

        this.food = 2;
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