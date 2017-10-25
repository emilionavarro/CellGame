const Cell = require('../classes/Cell');
const Genes = require('./../enums/Genes');

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
        return new TestCell(this.attributes[Genes.LifeSpan],
            this.attributes[Genes.MaxOffspring],
            { x: this.attributes[Genes.MoveX], y: this.attributes[Genes.MoveY] },
            position,
            true);
    }
}

module.exports = TestCell;