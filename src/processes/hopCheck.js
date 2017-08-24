const libArgs = require('../libs/args');
const libWritter = require('../libs/writter');

function splitTask(task) {
    return {
        startingPoint: task.charAt(0),
        endingPoint: task.charAt(1),
        hops: parseInt(task.charAt(2), 10),
    };
}

function countRoutes(graph, hops, nodes, endChar) {
    if (hops === 0) {
        return 0;
    }

    if (nodes.some(node => node.charAt(1) === endChar.toUpperCase())) {
        return 1;
    }

    let newNodes;
    return nodes.reduce((count, node) => {
        let internalCounter = count;
        newNodes = graph.filter(element => element.startsWith(node.charAt(1).toUpperCase()));
        internalCounter += countRoutes(graph, hops - 1, newNodes, endChar);
        return internalCounter;
    }, 0);
}

(async () => {
    try {
        const task = await libArgs.getTask(process.argv, 2);
        const graph = (await libArgs.getGraph(process.argv, 3)).split(',');
        const routeRequirements = splitTask(task);
        const startChar = routeRequirements.startingPoint;
        const endChar = routeRequirements.endingPoint;
        const hops = routeRequirements.hops;
        const startNodes = graph.filter(element => element.startsWith(startChar.toUpperCase()));
        const distanceCount = countRoutes(graph, hops, startNodes, endChar);

        libWritter.writeMessage(`number of trips for ${task}: ${distanceCount}`);
    } catch (error) {
        libWritter.writeError(error);
    }
})();
