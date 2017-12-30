'use strict'
const common = require('../common')

common.emitter.on('eventsLoadCompleted', (ip) => {
    require('../jobs')
})