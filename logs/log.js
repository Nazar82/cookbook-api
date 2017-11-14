const winston = require('winston');

module.exports = (module) => {
    return makeLogger(module.filename);
};

function makeLogger(path) {
    if (path.match(/server.js$/)) {
        const transports = [
            new winston.transports.Console({
                timestsmp: true,
                colorize: true,
                level: 'info',
            }),

            new winston.transports.File({ filename: './logs/serverDebug.log', level: 'debug' }),

        ];
        return new winston.Logger({ transports: transports });
    }

    if (path.match(/api.js$/)) {
        const transports = [
            new winston.transports.Console({
                timestsmp: true,
                colorize: true,
                level: 'info',
            }),

            new winston.transports.File({ filename: './logs/apiDebug.log', level: 'debug' }),

        ];
        return new winston.Logger({ transports: transports });
    } else {
        new winston.Logger({ transports: [] });
    }
}
