class Mutations {
    static InsertionMutation (cell) {
        var len = cell.attributes.length;

        var mutationFromIndex = GetRandomMutationIndex(len);
        var mutationToIndex = GetRandomMutationIndex(len);
        var movingMutation = cell.attributes[mutationFromIndex];
        
        // Verify that we dont add to the end something that does not exist anymore.
        if (mutationToIndex === len)
            mutationToIndex = len - 1;
        
        cell.attributes.splice(mutationFromIndex, 1);
        cell.attributes.splice(mutationToIndex, 0, movingMutation);
    }

    static ExchangeMutation (cell) {
        var len = cell.attributes.length;
        var mutationFromIndex = GetRandomMutationIndex(len);
        var mutationToIndex = GetRandomMutationIndex(len);
        var movingMutation = cell.attributes[mutationFromIndex];

        // Verify that we dont add to the end something that does not exist anymore.
        if (mutationToIndex === len) 
            mutationToIndex = len - 1;
            
        cell.attributes.splice(mutationFromIndex, 1, cell.attributes[mutationToIndex]);
        cell.attributes.splice(mutationToIndex, 1, movingMutation);
    }

    static DisplacementMutation (cell) {
        var len = cell.attributes.length;
        var mutationFromIndex = GetRandomMutationIndex(len);
        var mutationLength = GetRandomMutationIndex(len);
        var movingMutation = [];

        // Must have at least one mutation
        if (mutationLength === 0) 
            mutationLength++;

        // Make sure we dont over do it
        if ((mutationFromIndex + mutationLength) > len)
            mutationLength = len - mutationFromIndex;

        movingMutation = cell.attributes.splice(mutationFromIndex, mutationLength);

        // Get location we going to place in
        var mutationToIndex = GetRandomMutationIndex(cell.attributes.length);

        for (var i = 0; i < mutationLength; i++)
            cell.attributes.splice((mutationToIndex + i), 0, movingMutation[i]);
    }

    static InversionMutation(cell) {
        var len = cell.attributes.length;
        var mutationFromIndex = GetRandomMutationIndex(len);
        var mutationToIndex = GetRandomMutationIndex(len);
        var mutationLength = 0;
        var movingMutation = [];

        // Make sure they are in right order
        if (mutationFromIndex > mutationToIndex) {
            var temp = mutationToIndex;
            mutationFromIndex = mutationToIndex;
            mutationToIndex = temp;
        }

        for (var i = mutationToIndex; i > mutationFromIndex; i--) 
            movingMutation.push(cell.attributes.splice(i, 1));

        mutationLength = mutationToIndex - mutationFromIndex;
        for (var i = 0; i < mutationLength; i++)
            cell.attributes.splice((mutationFromIndex + i), 0, movingMutation[i]);
    }

}

function GetRandomMutationIndex(numberTo) {
    return (Math.floor(numberTo * Math.random()));
}

module.exports = Mutations;