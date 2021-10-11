const job = require('node-cron')
const SendMailOnTuvExpiredJob = require('./Dates/SendMailOnTuvExpiredJob')
const TuvExpiresInSixtyOrThirtyDaysJob = require('./Dates/TuvExpiresInSixtyOrThirtyDaysJob')
const AuExpiresInSixtyOrThirtyDaysJob = require('./Dates/AuExpiresInSixtyOrThirtyDaysJob')

const sendMailOnTuvExpiredJob = new SendMailOnTuvExpiredJob()
const tuvExpiresInSixtyOrThirtyDaysJob = new TuvExpiresInSixtyOrThirtyDaysJob()
const auExpiresInSixtyOrThirtyDaysJob = new AuExpiresInSixtyOrThirtyDaysJob()

const jobScheduler = (second = '*', minute = '*', hour = '*', dayOfMonth = '*', month = '*', dayOfWeek = '*') => {
    job.schedule(`*/${second} ${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`, sendMailOnTuvExpiredJob.doJob.bind(sendMailOnTuvExpiredJob));
    job.schedule(`*/${second} ${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`, tuvExpiresInSixtyOrThirtyDaysJob.doJob.bind(tuvExpiresInSixtyOrThirtyDaysJob));
    job.schedule(`*/${second} ${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`, auExpiresInSixtyOrThirtyDaysJob.doJob.bind(auExpiresInSixtyOrThirtyDaysJob));
}

module.exports = jobScheduler