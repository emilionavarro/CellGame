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
        return this.GetRandomInRange(1, Math.ceil(this.GetBoardSize() / 5));
    }

    // Start cell food requirement for children.
    static GenerateStartFoodRequirement() {
        return this.GetRandomInRange(1, 3);
    }

    // start cell Starting food
    static GenerateStartFood() {
        return 0;
    }

    static printCell(cell) {
        console.log("Generation: " + cell._generation);
        console.log("Location: " + cell.position.x + "," + cell.position.y);
        console.log("Max life: " + cell.attributes[Genes.LifeSpan]);
        console.log("xMovement: " + cell.attributes[Genes.MoveX]);
        console.log("yMovement: " + cell.attributes[Genes.MoveY]);
        console.log("maxOffSpring: " + cell.attributes[Genes.MaxOffspring]);
    }
}

module.exports = Helpers;