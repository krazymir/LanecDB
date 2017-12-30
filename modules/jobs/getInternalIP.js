'use strict'

const common = require('../common')

function internalIP() {
    const ifaces = require('os').networkInterfaces()
    let address
    Object.keys(ifaces).forEach(dev => {
        ifaces[dev].filter(details => {
            if (details.family === 'IPv4' && details.internal === false) {
                address = details.address
                common.config.internalIP = details.address
            }
        })
    })
    if (address) {
        common.emitter.emit('ipDiscovered', common.config.internalIP)
        common.log.info(`Acquirired internal IP: ${common.config.internalIP}`)
    }
}

module.exports.run = () => {
    internalIP()
}