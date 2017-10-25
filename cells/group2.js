const Cell = require('../classes/Cell');
const Genes = require('./../enums/Genes');

class Group2 extends Cell {
    constructor (lifeSpan, maxOffspring, direction, position, mutate) {
        super(lifeSpan, maxOffspring, direction, position, "Group 2", mutate);
        this.SetCharacter();
    }

    SetCharacter() {
        this.character = "\x1b[34m" + "O" + "\x1b[0m";
    }

    GetType() {
        return "Group 2";
    }

    SetMutation() {
        this.mutation = this.ExchangeMutation;
    }

    CreateChild(position) {
        return new Group2(this.attributes[Genes.LifeSpan],
            this.attributes[Genes.MaxOffspring],
            { x: this.attributes[Genes.MoveX], y: this.attributes[Genes.MoveY] },
            position,
            true);
    }
}

module.exports = Group2;