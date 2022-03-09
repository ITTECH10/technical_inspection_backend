const User = require('../../../models/UserModel')
const Vehicle = require('../../../models/VehicleModel')
const UserRelatedNotifications = require('../../../utils/Emails/UserRelatedNotifications')
const DateGenerator = require('../../../utils/DateGenerator')
const CreditPayment = require('../../../models/CreditPaymentModel')

const threeMonthsFromNow = new DateGenerator().monthsFromNow(3).setHours(23, 59, 59, 999)
const eightMonthsFromNow = new DateGenerator().monthsFromNow(8).setHours(23, 59, 59, 999)
const currentDate = new Date().toISOString()

// Send email to a customer if finanses expires
class SendMailOnFinansesExpiringJob extends UserRelatedNotifications {
    constructor() {
        super()
        this.finansesExpiringInThreeMonthsVehicles = []
        this.finansesExpiringInSixMonthsVehicles = []
    }

    async finansesExpiresInThreeMonths() {
        this.finansesExpiringInThreeMonthsVehicles = await Vehicle.find({ contractExpirationDate: { $gte: currentDate, $lte: threeMonthsFromNow }, vehiclePaymentTypeVariant: 'credit' })
        if (this.finansesExpiringInThreeMonthsVehicles.length === 0) return

        this.finansesExpiringInThreeMonthsVehicles.map(async foundVehicle => {
            try {
                const users = await User.find({ _id: foundVehicle.vehicleOwner })

                users.forEach(async (user) => {
                    if (!foundVehicle.creditExpiresInUpcomingThreeMonthsNotifier) {
                        try {
                            if (user.customerType === 'firmenkunde') {
                                await super.creditExpiresInThreeMonths({ email: user.corespondencePartnerEmail }, foundVehicle)
                            }

                            if (user.customerType === 'privat') {
                                await super.creditExpiresInThreeMonths(user, foundVehicle)
                            }

                            await foundVehicle.createFinansesExpiresInThreeMonthsEmailNotifier(user._id)
                            await foundVehicle.save({ validateBeforeSave: false })
                        } catch (err) {
                            console.log(err)
                            foundVehicle.creditExpiresInUpcomingThreeMonthsNotifier = undefined
                            await foundVehicle.save({ validateBeforeSave: false })
                        }
                    }
                })
            } catch (err) {
                console.log(err)
            }
        })
    }

    async finansesExpiresInSixMonths() {
        this.finansesExpiringInSixMonthsVehicles = await Vehicle.find({ contractExpirationDate: { $gte: threeMonthsFromNow, $lte: eightMonthsFromNow }, vehiclePaymentTypeVariant: 'credit' })
        if (this.finansesExpiringInSixMonthsVehicles.length === 0) return

        this.finansesExpiringInSixMonthsVehicles.map(async foundVehicle => {
            try {
                const users = await User.find({ _id: foundVehicle.vehicleOwner })

                users.forEach(async (user) => {
                    if (!foundVehicle.creditExpiresInUpcomingSixMonthsNotifier) {
                        try {
                            if (user.customerType === 'firmenkunde') {
                                await super.creditExpiresInSixMonths({ email: user.corespondencePartnerEmail }, foundVehicle)
                            }

                            if (user.customerType === 'privat') {
                                await super.creditExpiresInSixMonths(user, foundVehicle)
                            }

                            await foundVehicle.createFinansesExpiresInSixMonthsEmailNotifier(user._id)
                            await foundVehicle.save({ validateBeforeSave: false })
                        } catch (err) {
                            console.log(err)
                            foundVehicle.creditExpiresInUpcomingSixMonthsNotifier = undefined
                            await foundVehicle.save({ validateBeforeSave: false })
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
