// Initializing the common module and logging
const common = require('./modules/common')
const settings = common.settings

require('./modules/eventHandlers')

// Initializing the web server
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())

// Adding global authentication header
app.use(function (req, res, next) {
    res.header("X-powered-by", "Blood-sweat-tears")
    next()
})

app.post('/db/:key', (req, res) => {
    common.emitter.emit('dbSet', req.params.key, req.body, res)
}
).put('/db/:key', (req, res) => {
    common.emitter.emit('dbSet', req.params.key, req.body, res)
}
    ).get('/db/:key', (req, res) => {
        common.emitter.emit('dbGet', req.params.key, res)
    }
    ).delete('/db/:key', (req, res) => {
        common.emitter.emit('dbDelete', req.params.key, res)
    }
    ).listen(settings.api.port, () => {
        console.log(`Starting the web server on port ${settings.api.port}`)
    }
    )

// Adding global error handling middleware
app.use(function (err, req, res, next) {
    common.log.error(err)
    res.status(500).send('Something broke!').end()
})
