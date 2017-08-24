const libArgs = require('../libs/args');
const libWritter = require('../libs/writter');

function splitTask(task) {
    return {
        startingPoint: task.charAt(0),
        endingPoint: task.charAt(1),
    };
}

function compareDuplicates(array) {
    const sortedArray = array.slice().sort();

    if (sortedArray.length > 1) {
        // console.log('conparing', sortedArray);
        for (let index = 0; index < sortedArray.length; index += 1) {
            // console.log('1', sortedArray[index + 1]);
            // console.log('0', sortedArray[index]);
            if (sortedArray[index] &&
                sortedArray[index + 1] &&
                sortedArray[index + 1][0] === sortedArray[index][0] &&
                sortedArray[index + 1][1] === sortedArray[index][1]) {
                return false;
            }
        }
    }
    return true;
}

function buildTree(startNode, nodes, startChar, endChar, graph, interm) {
    const intermmediateNodes = graph.filter(interNode => interNode.charAt(0) === startNode.charAt(1));
    interm.push(intermmediateNodes);
    if (!compareDuplicates(interm)) {
        interm = [];
        nodes.push([startNode]);
        return;
    }
    console.log('inter', intermmediateNodes);
    intermmediateNodes.forEach((interNode) => {
        if (interNode.charAt(1) === endChar.toUpperCase()
            && interNode.charAt(0) === startNode.charAt(1).toUpperCase()) {
            nodes.push([startNode, interNode]);
        } else {
            buildTree(interNode, nodes, startChar, endChar, graph, interm);
        }
    }, this);
    console.log(nodes);
    nodes.forEach((node, index) => {
        if (node.every(value => value.charAt(0) !== startChar.toUpperCase())) {
            node.unshift(startNode);
        }
    }, this);
    return nodes;
}

function gatherNodes(startChar, endChar, graph) {
    const startNodes = graph.filter(node => node.charAt(0) === startChar.toUpperCase());
    console.log('start', startNodes);
    let tree = [];
    startNodes.forEach((node) => {
        tree = buildTree(node, tree, startChar, endChar, graph, []);
        // tree.unshift(node);
    }, this);
    console.log(tree);
    const endNodes = graph.filter(node => node.charAt(1) === endChar.toUpperCase());
    console.log('end', endNodes);
}

(async () => {
    try {
        const task = await libArgs.getTask(process.argv, 2);
        const graph = (await libArgs.getGraph(process.argv, 3)).split(',');
        const routeRequirements = splitTask(task);
        const startChar = routeRequirements.startingPoint;
        const endChar = routeRequirements.endingPoint;

        gatherNodes(startChar, endChar, graph);

        // libWritter.writeMessage(`Shortest route from ${task}: ${length}`);
    } catch (error) {
        libWritter.writeError(error);
    }
})();
