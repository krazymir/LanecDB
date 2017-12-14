'use strict'

const settings = require('../../settings.json')
const schedule = require('node-schedule')
const common = require('../common')

settings.recurringJobs.forEach((job) => {
    try {
        let mod = require(`./${job.module}`)
        if (job.cron) {
            if(job.startImmediately) {
                mod.run(job.args)
            }
            let j = schedule.scheduleJob(job.cron, function () {
                mod.run(job.args)
            })
        }
        else {
            mod.run(job.args)
        }
    }
    catch (err) {
        common.log.error(err.message)
    }
})