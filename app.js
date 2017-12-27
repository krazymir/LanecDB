// Initializing and setting up recurring jobs
require('./modules/jobs')

// Initializing the common module and logging
const common = require('./modules/common')
const settings = common.settings

// Initializing all event handlers
require('./modules/eventHandlers')

common.log.info('Starting the web server...')

// Initializing the web server
const express = require('express')
const app = express()

app.get('/', (req, res) => {
    let a = global.localIP
    res.send('Hello World!')
}
)

app.listen(settings.api.port, () => {
    common.log.info(`Starting the web server on port ${settings.api.port}`)
}
)