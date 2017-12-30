const fs = require('fs')
const common = require('../common')

// Processing all modules in the folder
try {
    fs.readdir(__dirname, (err, files) => {
        files.forEach(file => {
            if (!__filename.endsWith(file) && file.toLowerCase().endsWith('.js')) {
                require(`./${file}`)
            }
        })
        common.emitter.emit('eventsLoadCompleted', common.config.internalIP)
    })
}
catch (err) {
    common.log.error(err.message)
}