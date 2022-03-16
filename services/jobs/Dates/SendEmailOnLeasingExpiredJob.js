const LeasingPayment = require('../../../models/LeasingPaymentModel')
const Vehicle = require('../../../models/VehicleModel')
const User = require('../../../models/UserModel')
const UserRelatedNotifications = require('../../../utils/Emails/UserRelatedNotifications')
const DateGenerator = require('../../../utils/DateGenerator')

const threeMonthsFromNow = new DateGenerator().monthsFromNow(3).setHours(23, 59, 59, 999)
const eightMonthsFromNow = new DateGenerator().monthsFromNow(8).setHours(23, 59, 59, 999)
const currentDate = new Date().toLocaleString('de-DE')

// // Send email to a customer if leasing expires
class SendMailOnLeasingExpiredJob extends UserRelatedNotifications {
    constructor() {
        super()
        this.leasingExpiringInThreeMonthsVehicles = []
        this.leasingExpiringInSixMonthsVehicles = []
    }

    async leasingExpiresInThreeMonths() {
        this.leasingExpiringInThreeMonthsVehicles = await Vehicle.find({ contractExpirationDate: { $gte: currentDate, $lte: threeMonthsFromNow }, vehiclePaymentTypeVariant: 'leasing' })
        if (this.leasingExpiringInThreeMonthsVehicles.length === 0) return

        this.leasingExpiringInThreeMonthsVehicles.map(async foundVehicle => {
            try {
                const users = await User.find({ _id: foundVehicle.vehicleOwner })

                users.forEach(async (user) => {
                    if (!foundVehicle.leasingExpiresInUpcomingThreeMonthsNotifier) {
                        try {
                            if (user.customerType === 'firmenkunde') {
                                await super.leasingExpiresInThreeMonths({ email: user.corespondencePartnerEmail }, foundVehicle)
                            }

                            if (user.customerType === 'privat') {
                                await super.leasingExpiresInThreeMonths(user, foundVehicle)
                            }

                            await foundVehicle.createLeasingExpiresInThreeMonthsEmailNotifier(user._id)
                            await foundVehicle.save({ validateBeforeSave: false })
                        } catch (err) {
                            console.log(err)
                            foundVehicle.leasingExpiresInUpcomingThreeMonthsNotifier = undefined
                            await foundVehicle.save({ validateBeforeSave: false })
                        }
                    }
                })
            } catch (err) {
                console.log(err)
            }
        })
    }

    async leasingExpiresInEightMonths() {
        this.leasingExpiringInSixMonthsVehicles = await Vehicle.find({ contractExpirationDate: { $gte: threeMonthsFromNow, $lte: eightMonthsFromNow }, vehiclePaymentTypeVariant: 'leasing' })
        if (this.leasingExpiringInSixMonthsVehicles.length === 0) return

        this.leasingExpiringInSixMonthsVehicles.map(async foundVehicle => {
            try {
                const users = await User.find({ _id: foundVehicle.vehicleOwner })

                users.forEach(async (user) => {
                    if (!foundVehicle.leasingExpiresInUpcomingSixMonthsNotifier) {
                        try {
                            if (user.customerType === 'firmenkunde') {
                                await super.leasingExpiresInEightMonths({ email: user.corespondencePartnerEmail }, foundVehicle)
                            }

                            if (user.customerType === 'privat') {
                                await super.leasingExpiresInEightMonths(user, foundVehicle)
                            }

                            await foundVehicle.createLeasingExpiresInSixMonthsEmailNotifier(user._id)
                            await foundVehicle.save({ validateBeforeSave: false })
                        } catch (err) {
                            console.log(err)
                            foundVehicle.leasingExpiresInUpcomingSixMonthsNotifier = undefined
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

module.exports = SendMailOnLeasingExpiredJob
