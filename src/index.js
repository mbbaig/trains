const os = require('os');
const asynclib = require('async');
const fs = require('fs-extra');
const path = require('path');
const libProcessor = require('./libs/processor');
const libArgs = require('./libs/args');
const logger = require('./libs/logger');
const constants = require('./utils/constants');

(async () => {
    try {
        const NUMBER_OF_CPUS = os.cpus().length;
        const TASKS = await fs.readJson(path.join(__dirname, '../config/tasks.json'));
        const graph = await libArgs.getGraph(process.argv, 2);

        libProcessor.startChildProcess(constants.lengthCheckExecutor, 'ac', graph);
        // libProcessor.startChildProcess(constants.lengthCheckExecutor, 'bb', graph);

        // asynclib.eachLimit(TASKS, NUMBER_OF_CPUS, (task, callback) => {
        //     if (task.type === constants.distanceType) {
        //         libProcessor.startChildProcess(constants.distanceExecutor, task.task, graph);
        //     } else if (task.type === constants.hopCheckType) {
        //         libProcessor.startChildProcess(constants.hopCheckExecutor, task.task, graph);
        //     }
        //     callback();
        // }, (err) => {
        //     if (err) {
        //         logger.error(err);
        //     }
        // });
    } catch (err) {
        logger.error(err);
    }
})();
