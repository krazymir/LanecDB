'use strict'

const common = require('../common')

function discoverNodes(a) {
    common.log.info('Starting node discovery...')
}

module.exports.run = (a) => {
    discoverNodes(a)
}