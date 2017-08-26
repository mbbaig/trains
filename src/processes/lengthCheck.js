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
    let obj;
    return filtered.reduce((accum, currVal, index) => {
        obj = buildTree(currVal, graph, endChar, preventInifinite - 1);
        if (obj) {
            accum[`${node}${index}`] = obj;
        }
        return accum;
    }, {});
}

function gatherNodes(startChar, endChar, graph) {
    const startNodes = graph.filter(node => node.charAt(0) === startChar.toUpperCase());
    const tree = {};

    startNodes.forEach((node) => {
        Object.assign(tree, buildTree(node, graph, endChar, Math.floor(graph.length / 2)));
    }, this);

    return tree;
}

function calculateAllLengths(entries, lengths, length) {
    if (typeof entries === 'string') {
        length += parseInt(entries.charAt(2), 10);
        lengths.push(length);
        lenght = 0;
        return lengths;
    } else if (typeof entries === 'object') {
        /* eslint guard-for-in: "off", no-restricted-syntax: "off" */
        for (const key in entries) {
            if (key !== 'node') {
                length += parseInt(key.charAt(2), 10);
            }
            lenghts = calculateAllLengths(entries[key], lengths, length);
            length = 0;
        }
    }

    return lengths;
}

function getShortestLength(lengths) {
    return Math.min(...lengths);
}

(async () => {
    try {
        const task = await libArgs.getTask(process.argv, 2);
        const graph = (await libArgs.getGraph(process.argv, 3)).split(',');
        const routeRequirements = splitTask(task);
        const startChar = routeRequirements.startingPoint;
        const endChar = routeRequirements.endingPoint;
        const entries = gatherNodes(startChar, endChar, graph);
        const lengths = calculateAllLengths(entries, [], 0);
        const shortestLength = getShortestLength(lengths);

        libWritter.writeMessage(`Shortest route from ${task}: ${shortestLength}`);
    } catch (error) {
        libWritter.writeError(error);
    }
})();
