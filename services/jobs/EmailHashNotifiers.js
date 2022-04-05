const User = require('../../models/UserModel')

class EmailHashNotifiersJob {
    async deleteEmailHashNotifier() {
        const users = await User.find({
            $or: [
                { TuvExpiresInNextMonthNotifier: { $exists: true } },
                { TuvExpiresInNextTwoMonthsNotifier: { $exists: true } },
                // { AuExpiresInNextMonthNotifier: { $exists: true } },
                // { AuExpiresInNextTwoMonthsNotifier: { $exists: true } },
                { leasingExpiredEmailNotifier: { $exists: true } },
                { creditExpiresInUpcomingThreeMonthsNotifier: { $exists: true } },
                { creditExpiresInUpcomingSixMonthsNotifier: { $exists: true } },
                { leasingExpiresInUpcomingThreeMonthsNotifier: { $exists: true } },
                { leasingExpiresInUpcomingSixMonthsNotifier: { $exists: true } },
                { creditExpiresInUpcomingSixMonthsNotifier: { $exists: true } },
                { ntiServiceExpiresInOneMonthEmailNotifier: { $exists: true } }
            ]
        })

        if (users.length > 0) {
            users.forEach(async user => {
                user.TuvExpiresInNextMonthNotifier = undefined
                user.TuvExpiresInNextTwoMonthsNotifier = undefined
                // user.AuExpiresInNextMonthNotifier = undefined
                // user.AuExpiresInNextTwoMonthsNotifier = undefined
                user.leasingExpiredEmailNotifier = undefined
                user.creditExpiresInUpcomingThreeMonthsNotifier = undefined
                user.creditExpiresInUpcomingSixMonthsNotifier = undefined
                user.leasingExpiresInUpcomingThreeMonthsNotifier = undefined
                user.leasingExpiresInUpcomingSixMonthsNotifier = undefined
                user.ntiServiceExpiresInOneMonthEmailNotifier = undefined

                await user.save({ validateBeforeSave: false })
            })
        }
    }
}

module.exports = EmailHashNotifiersJob