class Helpers {
    constructor () {   
    }

    static GetRandomInRange(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
}

module.exports = Helpers;