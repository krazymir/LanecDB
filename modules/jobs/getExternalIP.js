'use strict'

const common = require('../common')

function initIP(a) {
    common.log.info('Acquiring own external IP...')
    const http = require('http')
    common.config.externalIP = null
    for (var i = 0, len = a.length; i < len; i++) {
        try {
            if (common.config.externalIP) {
                break;
            }
            http.get(a[i], (resp) => {
                let data = ''

                resp.on('data', (chunk) => {
                    data += chunk
                })

                resp.on('end', () => {
                    let regex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/
                    let result = data.match(regex)
                    if (result && result.length > 0) {
                        let ipStr = result[0]
                        if (ipStr) {
                            common.config.externalIP = ipStr
                            //common.emitter.emit('ipDiscovered', common.config.externalIP)
                            common.log.info(`Acquirired external IP: ${common.config.externalIP}`)
                        }
                    }
                })

            }).on("error", (err) => {
                common.log.error(err.message)
            })
        }
        catch (err) {
            common.log.error(err.message)
        }
    }
}

module.exports.run = (a) => {
    initIP(a)
}