const LeasingPayment = require('../../../models/LeasingPaymentModel')
const User = require('../../../models/UserModel')
const EmailJob = require('../EmailJob')
const DateGenerator = require('../../../utils/DateGenerator')

const sixMonthsFromNow = new DateGenerator().monthsFromNow(6).setHours(23, 59, 59, 999)
const currentDate = new Date()

// Send email to a customer if TUV,AU,GENERAL INSPECTION EXPIRES
class LeasingExpiresInThreeMonthsJob extends EmailJob {
    constructor() {
        super()
        this.leasingExpiringVehicles = []
    }

    async doJob() {
        this.leasingExpiringVehicles = await LeasingPayment.find({ leasingEndsOn: { $gte: currentDate, $lte: sixMonthsFromNow } })
        // LOG HERE
        if (this.leasingExpiringVehicles.length === 0) return
        this.leasingExpiringVehicles.map(async foundVehicle => {
            if (!foundVehicle.vehiclePayedFor) return
            try {
                const users = await User.find({ _id: foundVehicle.vehiclePayedFor.vehicleOwner._id })

                users.forEach(async (user) => {
                    if (user.leasingExpiredEmailNotifier && !await user.compareLeasingEmailExpiredNotifier(user._id, user.leasingExpiredEmailNotifier)) {
                        throw new Error('Leasing email hash comparasion did not match!')
                    }

                    if (!user.leasingExpiredEmailNotifier) {
                        try {
                            const body = `Leasing für Ihr Fahrzeug ${foundVehicle.vehiclePayedFor.mark} ${foundVehicle.vehiclePayedFor.model} läuft in sechts monaten ab.`
                            const emailTo = foundVehicle.vehiclePayedFor.vehicleOwner

                            await super.sendToCustomer(emailTo, "Leasing läuft ab in", body)
                            await user.createLeasingExpiredEmailNotifier(user._id)
                            await user.save({ validateBeforeSave: false })
                        } catch (err) {
                            console.log(err)
                            user.leasingExpiredEmailNotifier = undefined
                            await user.save({ validateBeforeSave: false })
                        }
                    }
                })
            } catch (err) {
                console.log(err)
            }
        })
    }
}

module.exports = LeasingExpiresInThreeMonthsJob
