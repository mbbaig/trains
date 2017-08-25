const libArgs = require('../libs/args');
const libWritter = require('../libs/writter');

function splitTask(task) {
    return {
        startingPoint: task.charAt(0),
        endingPoint: task.charAt(1),
    };
}

function buildTree(node, graph, endChar, preventInifinite) {
    if (preventInifinite === 0) {
        return null;
    }
    if (node.charAt(1) === endChar.toUpperCase()) {
        return { node };
    }
    const filtered = graph.filter(value => value.charAt(0) === node.charAt(1));

    return filtered.reduce((accum, currVal, index) => {
        accum[`${node}${index}`] = buildTree(currVal, graph, endChar, preventInifinite - 1);
        return accum;
    }, {});
}

function gatherNodes(startChar, endChar, graph) {
    const startNodes = graph.filter(node => node.charAt(0) === startChar.toUpperCase());
    const tree = {};

    startNodes.forEach((node) => {
        Object.assign(tree, buildTree(node, graph, endChar, Math.ceil(graph.length / 2)));
    }, this);

    return Object.entries(tree);
}

function getShortestLength(entries) {
    let length = 0;
    entries.forEach((entry) => {
        length = entry.reduce((accum, element, index) => {
            console.log(element);
            if (typeof element === 'object' && element.node) {
                accum += parseInt(element.node.charAt(2), 10);
                return accum;
            } else if (typeof element === 'string') {
                accum += parseInt(element.charAt(2), 10);
                console.log(accum);
            }
        }, 0);
    }, this);
    return length;
}

(async () => {
    try {
        const task = await libArgs.getTask(process.argv, 2);
        const graph = (await libArgs.getGraph(process.argv, 3)).split(',');
        const routeRequirements = splitTask(task);
        const startChar = routeRequirements.startingPoint;
        const endChar = routeRequirements.endingPoint;
        const entries = gatherNodes(startChar, endChar, graph);
        const length = getShortestLength(entries);

        libWritter.writeMessage(`Shortest route from ${task}: ${length}`);
    } catch (error) {
        libWritter.writeError(error);
    }
})();
