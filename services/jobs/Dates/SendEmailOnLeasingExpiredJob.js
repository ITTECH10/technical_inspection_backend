const LeasingPayment = require('../../../models/LeasingPaymentModel')
const User = require('../../../models/UserModel')
const EmailJob = require('../EmailJob')
const DateGenerator = require('../../../utils/DateGenerator')

const threeMonthsFromNow = new DateGenerator().monthsFromNow(3).setHours(23, 59, 59, 999)
const sixMonthsFromNow = new DateGenerator().monthsFromNow(6).setHours(23, 59, 59, 999)
const currentDate = new Date().toISOString()

// Send email to a customer if TUV,AU,GENERAL INSPECTION EXPIRES
class SendMailOnLeasingExpiredJob extends EmailJob {
    constructor() {
        super()
        this.leasingExpiringInThreeMonthsVehicles = []
        this.leasingExpiringInSixMonthsVehicles = []
    }

    async leasingExpiresInThreeMonths() {
        this.leasingExpiringInThreeMonthsVehicles = await LeasingPayment.find({ leasingEndsOn: { $gte: currentDate, $lte: threeMonthsFromNow } })
        if (this.leasingExpiringInThreeMonthsVehicles.length === 0) return

        this.leasingExpiringInThreeMonthsVehicles.map(async foundVehicle => {
            if (!foundVehicle.vehiclePayedFor || !foundVehicle.vehiclePayedFor.vehicleOwner) return

            try {
                const users = await User.find({ _id: foundVehicle.vehiclePayedFor.vehicleOwner._id })

                users.forEach(async (user) => {
                    if (user.leasingExpiredEmailNotifier && !await user.compareLeasingEmailExpiredNotifier(user._id, user.leasingExpiredEmailNotifier)) {
                        throw new Error('Leasing email hash comparasion did not match!')
                    }

                    if (!user.leasingExpiredEmailNotifier) {
                        try {
                            const body = `Leasing für Ihr Fahrzeug ${foundVehicle.vehiclePayedFor.mark} ${foundVehicle.vehiclePayedFor.model} läuft in drei monaten ab.`
                            const emailTo = foundVehicle.vehiclePayedFor.vehicleOwner

                            if (user.customerType === 'firmenkunde') {
                                await super.sendToContactPerson(user.corespondencePartnerEmail, "Leasing läuft ab", body)
                            }

                            if (user.customerType === 'privat') {
                                await super.sendToCustomer(emailTo, "Leasing läuft ab", body)
                            }

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

    async leasingExpiresInSixMonths() {
        this.leasingExpiringInSixMonthsVehicles = await LeasingPayment.find({ leasingEndsOn: { $gte: threeMonthsFromNow, $lte: sixMonthsFromNow } })
        if (this.leasingExpiringInSixMonthsVehicles.length === 0) return

        this.leasingExpiringInSixMonthsVehicles.map(async foundVehicle => {
            if (!foundVehicle.vehiclePayedFor || !foundVehicle.vehiclePayedFor.vehicleOwner) return

            try {
                const users = await User.find({ _id: foundVehicle.vehiclePayedFor.vehicleOwner._id })

                users.forEach(async (user) => {
                    if (user.leasingExpiredEmailNotifier && !await user.compareLeasingEmailExpiredNotifier(user._id, user.leasingExpiredEmailNotifier)) {
                        throw new Error('Leasing email hash comparasion did not match!')
                    }

                    if (!user.leasingExpiredEmailNotifier) {
                        try {
                            const body = `Leasing für Ihr Fahrzeug ${foundVehicle.vehiclePayedFor.mark} ${foundVehicle.vehiclePayedFor.model} läuft in sechs monaten ab.`
                            const emailTo = foundVehicle.vehiclePayedFor.vehicleOwner

                            if (user.customerType === 'firmenkunde') {
                                await super.sendToContactPerson(user.corespondencePartnerEmail, "Leasing läuft ab", body)
                            }

                            if (user.customerType === 'privat') {
                                await super.sendToCustomer(emailTo, "Leasing läuft ab", body)
                            }

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

module.exports = SendMailOnLeasingExpiredJob
