const Cell = require('../classes/Cell');

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
        return new Group2(this.properties.maxLifeSpan.value,
            this.properties.maxOffSpring.value,
            { x: this.properties.xMovement.value, y: this.properties.yMovement.value },
            position,
            true);
    }
}

module.exports = Group2;