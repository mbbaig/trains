const libArgs = require('../libs/args');
const libWritter = require('../libs/writter');

function splitTask(task) {
    const individualTasks = [];
    for (let i = 0; i < task.length - 1; i += 1) {
        individualTasks.push(task.slice(i, i + 2));
    }
    return individualTasks;
}

function countDistance(graph, splitTasks) {
    const routes = splitTasks.map(
        task => graph.find(
            element => element.startsWith(task.toUpperCase()),
        ),
    );

    if (routes.every(route => route)) {
        return routes.reduce((prevVal, currVal) => parseInt(currVal.charAt(2), 10) + prevVal, 0);
    }
    return 'NO SUCH ROUTE';
}

(async () => {
    try {
        const task = await libArgs.getTask(process.argv, 2);
        const graph = (await libArgs.getGraph(process.argv, 3)).split(',');
        const splitTasks = splitTask(task);
        const distanceCount = countDistance(graph, splitTasks);

        libWritter.writeMessage(`distance for ${task}: ${distanceCount}`);
    } catch (error) {
        libWritter.writeError(error);
    }
})();
