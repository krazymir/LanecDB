'use strict'

const common = require('../common')

common.emitter.on('dbSet', (key, value, res) => {
    common.db.set(key, value).then(() => {
        res.status(201).end()
    })
})