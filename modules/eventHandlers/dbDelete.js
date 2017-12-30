'use strict'

const common = require('../common')

common.emitter.on('dbDelete', (key, res) => {
    common.db.delete(key).then(() => {
        res.status(200).end()
    })
})