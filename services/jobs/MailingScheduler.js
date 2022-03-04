const job = require('node-cron')
const EmailHashNotifiersJob = require('./EmailHashNotifiers')

const SendMailOnTuvExpiredJob = require('./Dates/SendMailOnTuvExpiredJob')
const SendMailOnAuExpiredJob = require('./Dates/SendMailOnAuExpiredJob')
const SendMailOnLeasingExpiredJob = require('./Dates/SendEmailOnLeasingExpiredJob')
const SendMailOnFinansesExpiringJob = require('./Dates/SendMailOnFinansesExpiringJob')
// const SendMailOnNtiServiceExpiration = require('./Dates/SendMailOnNtiServiceExpiration')

// DELETING HASHED EMAIL NOTIFIERS
// const emailHashNotifiersJob = new EmailHashNotifiersJob()

// EMAIL NOTIFIERS SENDERS
const sendMailOnTuvExpiredJob = new SendMailOnTuvExpiredJob()
const sendMailOnAuExpiredJob = new SendMailOnAuExpiredJob()
// const sendMailOnNtiServiceExpiringInNextMonth = new SendMailOnNtiServiceExpiration()
const sendMailOnLeasingExpiredJob = new SendMailOnLeasingExpiredJob()
const sendMailOnFinansesExpiringJob = new SendMailOnFinansesExpiringJob()

function MailingScheduler() {
    // 1) TUV NOTIFIERS
    // job.schedule('*/15 * * * * *', sendMailOnTuvExpiredJob.tuvExpiringInOneMonth.bind(sendMailOnTuvExpiredJob));
    // job.schedule('*/15 * * * * *', sendMailOnTuvExpiredJob.tuvExpiringInTwoMonths.bind(sendMailOnTuvExpiredJob));

    // 2) AU NOTIFIERS
    // job.schedule('*/15 * * * * *', sendMailOnAuExpiredJob.auExpiringInOneMonth.bind(sendMailOnAuExpiredJob));
    // job.schedule('*/15 * * * * *', sendMailOnAuExpiredJob.auExpiringInTwoMonths.bind(sendMailOnAuExpiredJob));

    // 3) LEASING NOTIFIERS
    // job.schedule('*/15 * * * * *', sendMailOnLeasingExpiredJob.leasingExpiresInThreeMonths.bind(sendMailOnLeasingExpiredJob));
    // job.schedule('*/15 * * * * *', sendMailOnLeasingExpiredJob.leasingExpiresInSixMonths.bind(sendMailOnLeasingExpiredJob));

    // 4) FINANSE NOTIFIERS
    // job.schedule('*/15 * * * * *', sendMailOnFinansesExpiringJob.finansesExpiresInThreeMonths.bind(sendMailOnFinansesExpiringJob));
    // job.schedule('*/15 * * * * *', sendMailOnFinansesExpiringJob.finansesExpiresInSixMonths.bind(sendMailOnFinansesExpiringJob));

    // 5) NTI SERVICE NOTIFIERS
    // job.schedule('*/15 * * * * *', sendMailOnNtiServiceExpiringInNextMonth.ntiServiceExpiresInOneMonth.bind(sendMailOnNtiServiceExpiringInNextMonth));

    // 5) DELETE NOTIFIERS
    // job.schedule('*/4 * * * *', emailHashNotifiersJob.deleteEmailHashNotifier.bind(emailHashNotifiersJob));
}

module.exports = MailingScheduler
