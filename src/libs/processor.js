const path = require('path');
const spawn = require('child_process').spawn;

const logger = require('./logger');

module.exports = {
    startChildProcess: async (executor, task, graph) => {
        const childProcess = spawn('node', [
            path.join(__dirname, executor),
            task,
            graph,
        ]);

        childProcess.stdout.on('data', (data) => {
            logger.info(data.toString());
        });

        childProcess.stderr.on('data', (data) => {
            throw new Error(data.toString());
        });

        childProcess.on('close', () => {
            // logger.info(`${executor} finished`);
        });
    },
};
