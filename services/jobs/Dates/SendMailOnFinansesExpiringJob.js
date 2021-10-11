const User = require('../../../models/UserModel')
const EmailJob = require('../EmailJob')
const DateGenerator = require('../../../utils/DateGenerator')
const CreditPayment = require('../../../models/CreditPaymentModel')

const threeMonthsFromNow = new DateGenerator().monthsFromNow(3).setHours(23, 59, 59, 999)
const sixMonthsFromNow = new DateGenerator().monthsFromNow(6).setHours(23, 59, 59, 999)
const currentDate = new Date().toISOString()

// Send email to a customer if TUV,AU,GENERAL INSPECTION EXPIRES
class SendMailOnFinansesExpiringJob extends EmailJob {
    constructor() {
        super()
        this.finansesExpiringInThreeMonthsVehicles = []
        this.finansesExpiringInSixMonthsVehicles = []
    }

    async finansesExpiresInThreeMonths() {
        this.finansesExpiringInThreeMonthsVehicles = await CreditPayment.find({ creditEndsOn: { $gte: currentDate, $lte: threeMonthsFromNow } })
        if (this.finansesExpiringInThreeMonthsVehicles.length === 0) return

        this.finansesExpiringInThreeMonthsVehicles.map(async foundVehicle => {
            if (!foundVehicle.vehiclePayedFor || !foundVehicle.vehiclePayedFor.vehicleOwner) return

            try {
                const users = await User.find({ _id: foundVehicle.vehiclePayedFor.vehicleOwner._id })

                users.forEach(async (user) => {
                    if (user.finansesExpiredEmailNotifier && !await user.compareFinansesEmailExpiredNotifier(user._id, user.finansesExpiredEmailNotifier)) {
                        throw new Error('Leasing email hash comparasion did not match!')
                    }

                    if (!user.finansesExpiredEmailNotifier) {
                        try {
                            const body = `Finanzierung für Ihr Fahrzeug ${foundVehicle.vehiclePayedFor.mark} ${foundVehicle.vehiclePayedFor.model} läuft in drei monaten ab.`
                            const emailTo = foundVehicle.vehiclePayedFor.vehicleOwner

                            if (user.customerType === 'firmenkunde') {
                                await super.sendToContactPerson(user.corespondencePartnerEmail, "Finanzierung läuft ab", body)
                            }

                            if (user.customerType === 'privat') {
                                await super.sendToCustomer(emailTo, "Finanzierung läuft ab", body)
                            }

                            await user.createFinansesExpiredEmailNotifier(user._id)
                            await user.save({ validateBeforeSave: false })
                        } catch (err) {
                            console.log(err)
                            user.finansesExpiredEmailNotifier = undefined
                            await user.save({ validateBeforeSave: false })
                        }
                    }
                })
            } catch (err) {
                console.log(err)
            }
        })
    }

    async finansesExpiresInSixMonths() {
        this.finansesExpiringInSixMonthsVehicles = await CreditPayment.find({ creditEndsOn: { $gte: threeMonthsFromNow, $lte: sixMonthsFromNow } })
        if (this.finansesExpiringInSixMonthsVehicles.length === 0) return

        this.finansesExpiringInSixMonthsVehicles.map(async foundVehicle => {
            if (!foundVehicle.vehiclePayedFor || !foundVehicle.vehiclePayedFor.vehicleOwner) return

            try {
                const users = await User.find({ _id: foundVehicle.vehiclePayedFor.vehicleOwner._id })

                users.forEach(async (user) => {
                    if (user.finansesExpiredEmailNotifier && !await user.compareFinansesEmailExpiredNotifier(user._id, user.finansesExpiredEmailNotifier)) {
                        throw new Error('Leasing email hash comparasion did not match!')
                    }

                    if (!user.finansesExpiredEmailNotifier) {
                        try {
                            const body = `Finanzierung für Ihr Fahrzeug ${foundVehicle.vehiclePayedFor.mark} ${foundVehicle.vehiclePayedFor.model} läuft in sechts monaten ab.`
                            const emailTo = foundVehicle.vehiclePayedFor.vehicleOwner

                            if (user.customerType === 'firmenkunde') {
                                await super.sendToContactPerson(user.corespondencePartnerEmail, "Finanzierung läuft ab", body)
                            }

                            if (user.customerType === 'privat') {
                                await super.sendToCustomer(emailTo, "Finanzierung läuft ab", body)
                            }

                            await user.createFinansesExpiredEmailNotifier(user._id)
                            await user.save({ validateBeforeSave: false })
                        } catch (err) {
                            console.log(err)
                            user.finansesExpiredEmailNotifier = undefined
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

module.exports = SendMailOnFinansesExpiringJob
