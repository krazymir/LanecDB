'use strict'

const common = require('../common')

common.emitter.on('dbGet', (key, res) => {
    common.db.get(key).then((data) => {
        res.status(200).json(data);
    })
})