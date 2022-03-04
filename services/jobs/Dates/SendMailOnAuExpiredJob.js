const Vehicle = require('./../../../models/VehicleModel')
const User = require('./../../../models/UserModel')
const UserRelatedNotifications = require('../../../utils/Emails/UserRelatedNotifications')
const DateGenerator = require('../../../utils/DateGenerator')

// IMPORTANT TO BE GLOBAL SCOPE!
const oneMonthFromNow = new DateGenerator().monthsFromNow(1).setHours(23, 59, 59, 999)
const twoMonthsFromNow = new DateGenerator().monthsFromNow(2).setHours(23, 59, 59, 999)
const currentDate = new Date().toLocaleString('de-DE')

class SendMailOnAuExpiredJob extends UserRelatedNotifications {
    constructor() {
        super()
        this.AuExpiringInOneMonthsVehicles = []
        this.AuExpiringInTwoMonthsVehicles = []
    }

    async auExpiringInOneMonth() {
        this.AuExpiringInOneMonthsVehicles = await Vehicle.find({ AU: { $gte: currentDate, $lte: oneMonthFromNow }, carIsSold: false })
        if (this.AuExpiringInOneMonthsVehicles.length === 0) return

        this.AuExpiringInOneMonthsVehicles.map(async foundVehicle => {
            try {
                const users = await User.find({ _id: foundVehicle.vehicleOwner._id })

                users.forEach(async (user) => {
                    if (!foundVehicle.AuExpiresInNextMonthNotifier) {
                        try {
                            if (user.customerType === 'firmenkunde') {
                                await super.auExpiresInUpcomingMonth({ email: user.corespondencePartnerEmail }, foundVehicle)
                            }

                            if (user.customerType === 'privat') {
                                await super.auExpiresInUpcomingMonth(user, foundVehicle)
                            }

                            await foundVehicle.createAuExpiresInNextMonthNotifier(user._id)
                            await foundVehicle.save({ validateBeforeSave: false })
                        } catch (err) {
                            console.log(err)
                            foundVehicle.AuExpiresInNextMonthNotifier = undefined
                            await foundVehicle.save({ validateBeforeSave: false })
                        }
                    }
                })
            } catch (err) {
                console.log(err)
            }
        })
    }

    async auExpiringInTwoMonths() {
        this.AuExpiringInTwoMonthsVehicles = await Vehicle.find({ AU: { $gte: oneMonthFromNow, $lte: twoMonthsFromNow }, carIsSold: false })
        if (this.AuExpiringInTwoMonthsVehicles.length === 0) return

        this.AuExpiringInTwoMonthsVehicles.map(async foundVehicle => {
            try {
                const users = await User.find({ _id: foundVehicle.vehicleOwner._id })

                users.forEach(async (user) => {
                    if (!foundVehicle.AuExpiresInNextTwoMonthsNotifier) {
                        try {
                            if (user.customerType === 'firmenkunde') {
                                await super.auExpiresInUpcomingTwoMonths({ email: user.corespondencePartnerEmail }, foundVehicle)
                            }

                            if (user.customerType === 'privat') {
                                await super.auExpiresInUpcomingTwoMonths(user, foundVehicle)
                            }

                            await foundVehicle.createAuExpiresInNextTwoMonthsNotifier(user._id)
                            await foundVehicle.save({ validateBeforeSave: false })
                        } catch (err) {
                            console.log(err)
                            foundVehicle.AuExpiresInNextTwoMonthsNotifier = undefined
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

module.exports = SendMailOnAuExpiredJob
