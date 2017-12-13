let settings = require('../../settings.json');
let schedule = require('node-schedule');
settings.recurringJobs.forEach((job) => {
    try {
        let mod = require(`./${job.module}`);
        if (job.cron) {
            if(job.startImmediately) {
                mod.run(job.args);
            }
            let j = schedule.scheduleJob(job.cron, function () {
                mod.run(job.args);
            });
        }
        else {
            mod.run(job.args);
        }
    }
    catch (err) {

    }
});