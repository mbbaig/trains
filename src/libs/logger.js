const winston = require('winston');

const logger = new winston.Logger({
    transports: [
        new (winston.transports.Console)({
            colorize: true,
            timestamp: () => new Date().toLocaleString(),
            handleExceptions: true,
            humanReadableUnhandledException: true,
        }),
    ],
});

if (process.env.NODE_ENV === 'production') {
    // add remote logging transport
}

logger.exitOnError = false;

module.exports = logger;
