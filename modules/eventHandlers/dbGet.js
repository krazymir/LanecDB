'use strict'

const common = require('../common')

common.emitter.on('dbGet', (key, group, res) => {
    common.db.get(key, group).then((data) => {
        res.status(200).json(data);
    })
})