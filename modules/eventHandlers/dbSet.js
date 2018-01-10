'use strict'

const common = require('../common')

common.emitter.on('dbSet', (key, value, group, res) => {
    common.db.set(key, value, group).then(() => {
        res.status(201).end()
    })
})