'use strict'

const settings = require('../settings.json')
//const blockchain = require('./blockchain')

// Initializing logging to use throughout the application
const winston = require('winston')

winston.loggers.add(settings.logging.loggerName, settings.logging.loggerConfig)

const logger = winston.loggers.get(settings.logging.loggerName)

let obj = {
    log: logger,
    config: {}
}

module.exports = obj