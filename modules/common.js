'use strict'

const settings = require('../settings.json')

const EventEmitter = require('events');
// Adding an event emitter
class MainEmitter extends EventEmitter {}
const emit = new MainEmitter();

// Initializing logging to use throughout the application
const winston = require('winston')

winston.loggers.add(settings.logging.loggerName, settings.logging.loggerConfig)

const logger = winston.loggers.get(settings.logging.loggerName)

module.exports = {
    log: logger,
    emitter: emit,
    settings: settings,
    config: {
    }
}