class Helpers {
    constructor () {   
    }

    static GetRandomInRange(min, max) {
        return Math.round(Math.random() * (max - min) + min);
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