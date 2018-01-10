'use strict'

const common = require('../common')

common.emitter.on('dbDelete', (key, group, res) => {
    common.db.delete(key, group).then(() => {
        res.status(200).end()
    })
})