// Initializing and setting up recurring jobs
require('./modules/jobs')

// Initializing the common module and logging
const common = require('./modules/common')
common.log.info('Starting the server...')

// Initializing the web server
const express = require('express')
const app = express()

app.get('/', (req, res) => {
    let a = global.localIP
    res.send('Hello World!')
}
)

app.listen(3000, () => {
    common.log.info('Starting the web server...')
}
)