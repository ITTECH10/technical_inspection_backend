const User = require('../../models/UserModel')

class EmailHashNotifiersJob {
    constructor() {

    }

    //ADD FINANSES HASH LATER //TODO
    async deleteEmailHashNotifier() {
        const users = await User.find({
            $or: [
                { TuvExpiredEmailNotifier: { $exists: true } },
                { AuExpiredEmailNotifier: { $exists: true } },
                { leasingExpiredEmailNotifier: { $exists: true } },
                { finansesExpiredEmailNotifier: { $exists: true } }
            ]
        })

        if (users.length > 0) {
            users.forEach(async user => {
                user.TuvExpiredEmailNotifier = undefined
                user.AuExpiredEmailNotifier = undefined
                user.leasingExpiredEmailNotifier = undefined
                user.finansesExpiredEmailNotifier = undefined

                await user.save({ validateBeforeSave: false })
            })
        }
    }
}

module.exports = EmailHashNotifiersJob