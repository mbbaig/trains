const _ = require('lodash');
const libArgs = require('../libs/args');
const libWritter = require('../libs/writter');

function splitTask(task) {
    return {
        startingPoint: task.charAt(0),
        endingPoint: task.charAt(1),
        maxLengthOfRoutes: parseInt(task.slice(-2), 10),
    };
}

function buildTree(node, graph, endChar) {
    if (node.charAt(1) === endChar.toUpperCase()) {
        return { node };
    }
    const filtered = graph.filter(value => value.charAt(0) === node.charAt(1));
    let obj;
    return filtered.reduce((accum, currVal, index) => {
        obj = buildTree(currVal, graph, endChar);
        if (obj) {
            accum[`${node}${index}`] = obj;
        }
        return accum;
    }, {});
}

function buildExtraneousTree(node, graph, endChar, minTraverse, length) {
    length += parseInt(node.charAt(2), 10);
    if (node.charAt(1) === endChar.toUpperCase() &&
        minTraverse <= 0) {
        return { node };
    }
    const filtered = graph.filter(value => value.charAt(0) === node.charAt(1));
    let obj;
    return filtered.reduce((accum, currVal, index) => {
        obj = buildExtraneousTree(currVal, graph, endChar, minTraverse - 1, length);
        if (obj) {
            accum[`${node}${index}`] = obj;
            minTraverse = Math.floor(graph.length / 2) - 1;
            length = 0;
        }
        return accum;
    }, {});
}

function gatherNodes(startChar, endChar, graph) {
    const startNodes = graph.filter(node => node.charAt(0) === startChar.toUpperCase());
    const tree = [];

    startNodes.forEach((node) => {
        tree.push(buildTree(
            node,
            graph,
            endChar,
        ));
    }, this);

    startNodes.forEach((node) => {
        tree.push(buildExtraneousTree(
            node,
            graph,
            endChar,
            Math.floor(graph.length / 2) - 1,
            0,
        ));
    }, this);

    return tree;
}

function calculateLengths(entries, lengths, length, max) {
    if (typeof entries === 'string') {
        length += parseInt(entries.charAt(2), 10);
        if (length < max && lengths.filter(tempLenth => tempLenth === length).length < 2) {
            lengths.push(length);
        }
        lenght = 0;
        return lengths;
    } else if (typeof entries === 'object') {
        /* eslint guard-for-in: "off", no-restricted-syntax: "off" */
        for (const key in entries) {
            if (key !== 'node') {
                length += parseInt(key.charAt(2), 10);
            }
            lenghts = calculateLengths(entries[key], lengths, length, max);
            length = 0;
        }
    }

    return lengths;
}

function calculateAllLengths(entriesArray, lengths, length, max) {
    let allLengths = [];
    entriesArray.forEach((entry) => {
        allLengths = calculateLengths(entry, lengths, length, max);
    }, this);
    return allLengths;
}

(async () => {
    try {
        const task = await libArgs.getTask(process.argv, 2);
        const graph = (await libArgs.getGraph(process.argv, 3)).split(',');
        const routeRequirements = splitTask(task);
        const startChar = routeRequirements.startingPoint;
        const endChar = routeRequirements.endingPoint;
        const maxLength = routeRequirements.maxLengthOfRoutes;
        const entries = gatherNodes(startChar, endChar, graph);
        const lengths = calculateAllLengths(entries, [], 0, maxLength);

        libWritter.writeMessage(`Shortest route from ${task}: ${lengths.length}`);
    } catch (error) {
        libWritter.writeError(error);
    }
})();
