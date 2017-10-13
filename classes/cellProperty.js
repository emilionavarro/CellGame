class cellProperty {
    constructor(value, moveAble) {
        this.value = value;
        this.moveAble = moveAble;
    }

    IsMoveAble() {
        return this.moveAble;
    }
}

module.exports = cellProperty;