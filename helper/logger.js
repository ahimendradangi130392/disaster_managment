const winston = require('winston');
/**
* This function used for the manage the error log in the system
*/

module.exports = () => {
  const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ],
  });
  return logger;
}