'use strict'

const settings = require('../settings.json')
const utils = require('./utils')
const EventEmitter = require('events')
const db = require('./database')(settings.nodes.clusterName)

// Adding an event emitter
class MainEmitter extends EventEmitter { }
const emit = new MainEmitter();
// Initializing logging to use throughout the application
const winston = require('winston')

// If the port is not explicitly set - we choose an arbitrary one
if (isNaN(settings.api.port)) {
    settings.api.port = utils.getRandomRange(10000, 65500)
}

winston.loggers.add(settings.logging.loggerName, settings.logging.loggerConfig)

const logger = winston.loggers.get(settings.logging.loggerName)

module.exports = {
    log: logger,
    emitter: emit,
    db: db,
    knownNodes:[],
    utils: utils,
    settings: settings,
    config: {
    }
}