const Cell = require('../classes/Cell');

class TestCell extends Cell {
    constructor (lifeSpan, maxOffspring, direction, position, mutate) {
        super(lifeSpan, maxOffspring, direction, position, "TestCell", mutate);
        this.SetCharacter();
    }

    SetCharacter() {
        this.character = "\x1b[1m" + "X" + "\x1b[0m";
    }

    GetType() {
        return "TestCell";
    }

    CreateChild(position) {
        return new TestCell(this.properties.maxLifeSpan.value,
            this.properties.maxOffSpring.value,
            { x: this.properties.xMovement.value, y: this.properties.yMovement.value },
            position,
            true);
    }
}

module.exports = TestCell;