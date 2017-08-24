const constants = require('../utils/constants');

function isNodeFormatValid(vanillaGraph) {
    const formatError = vanillaGraph.split(',').every(node => node.trim().length === 3);
    if (!formatError || vanillaGraph.length === 0) {
        throw new Error(constants.nodeFormatError);
    }
}

function doArgsHaveErrors(args, position) {
    if (!args || args.length < 3) {
        throw new Error(constants.argumentsError);
    }

    const arg = args[position];

    if (!arg || !arg.trim()) {
        throw new Error(constants.graphError);
    }

    return arg;
}

module.exports = {
    getGraph: async (args, position) => {
        const graph = doArgsHaveErrors(args, position);
        isNodeFormatValid(graph);
        return graph;
    },
    getTask: async (args, position) => {
        const task = doArgsHaveErrors(args, position).trim();
        return task;
    },
};
