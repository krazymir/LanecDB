'use strict'

const common = require('../common')
const settings = common.settings

// Initializing the web server
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())

// Adding global authentication header
app.use(function (req, res, next) {
    res.header("X-powered-by", settings.appName)
    next()
})

app.post('/db/:key', (req, res) => {
    if(!req.get('pub') || !req.get('sig')){
        res.status(401).send('Unauthorized').end()
    }
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

module.exports = app