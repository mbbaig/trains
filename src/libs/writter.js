module.exports = {
    writeMessage: (message) => {
        process.stdout.write(message.toString());
    },
    writeError: (error) => {
        process.stderr.write(error.toString());
    },
};
